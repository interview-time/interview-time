using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Amazon.DynamoDBv2;
using Amazon.Extensions.NETCore.Setup;
using Amazon;
using CafApi.Services;
using Amazon.S3;
using SendGrid.Extensions.DependencyInjection;
using FluentValidation.AspNetCore;
using CafApi.ViewModel;
using CafApi.Services.User;
using CafApi.Repository;
using CafApi.Common;
using System.Threading.Tasks;
using CafApi.Query;
using MediatR;
using CafApi.Services.Integration;
using MailChimp.Net.Interfaces;
using MailChimp.Net;
using CafApi.Services.Demo;

namespace CafApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = Configuration["Auth0:Authority"];
                options.Audience = Configuration["Auth0:Audience"];
                options.RequireHttpsMetadata = false;
            });
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Admin", policy => policy.Requirements.Add(new IsAdminAuthorizationRequirement()));
            });

            services.AddCors(options =>
                   {
                       options.AddDefaultPolicy(
                                         builder =>
                                         {
                                             builder.WithOrigins(
                                                 "http://localhost:3000",
                                                 "https://*.netlify.app",
                                                 "https://app.interviewer.space",
                                                 "https://app-staging.interviewtime.io",
                                                 "https://app.interviewtime.io")
                                                .SetIsOriginAllowedToAllowWildcardSubdomains()
                                                .AllowAnyHeader()
                                                .AllowAnyMethod()
                                                .AllowCredentials();
                                         });
                   });

            services.AddControllers()
                .AddFluentValidation(fv =>
                    fv.RegisterValidatorsFromAssemblyContaining<ChangeMemberRoleRequestValidator>());

            services.AddMediatR(typeof(Startup));

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "InterviewTime API", Version = "v1" });
            });
            services.AddAWSService<IAmazonDynamoDB>();
            services.AddDefaultAWSOptions(
                new AWSOptions
                {
                    Region = RegionEndpoint.GetBySystemName("ap-southeast-2")
                }
            );

            //    var credentialChains = new Amazon.Runtime.CredentialManagement.CredentialProfileStoreChain();
            //             Amazon.Runtime.AWSCredentials credentials;
            //             if (!credentialChains.TryGetAWSCredentials(options.Profile, out credentials))
            //             {
            //                 credentials = Amazon.Runtime.FallbackCredentialsFactory.GetCredentials();
            //             }

            var s3Config = new AmazonS3Config
            {
                RegionEndpoint = RegionEndpoint.GetBySystemName("us-west-2"),
                UseAccelerateEndpoint = true
            };

            services.AddSendGrid(options =>
            {
                options.ApiKey = Configuration["SendGridApiKey"];
            });

            services.AddSingleton<IMailChimpManager>(new MailChimpManager(Configuration["MailChimpApiKey"]));

            services.AddSingleton<IAmazonS3>(new AmazonS3Client(s3Config));
            services.AddSingleton<IAuthorizationHandler, IsAdminAuthorizationHandler>();

            services.Configure<MergeOptions>(Configuration.GetSection(MergeOptions.Section));

            services.AddHttpClient<IMergeHttpClient, MergeHttpClient>();

            services.AddScoped<ITemplateService, TemplateService>();
            services.AddScoped<IInterviewService, InterviewService>();
            services.AddScoped<ITeamService, TeamService>();
            services.AddScoped<ICandidateService, CandidateService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IPermissionsService, PermissionsService>();
            services.AddScoped<ILibraryService, LibraryService>();
            services.AddScoped<IChallengeService, ChallengeService>();
            services.AddScoped<IDemoService, DemoService>();            

            services.AddScoped<IInterviewRepository, InterviewRepository>();
            services.AddScoped<IChallengeRepository, ChallengeRepository>();
            services.AddScoped<ICandidateRepository, CandidateRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITemplateRepository, TemplateRepository>();
            services.AddScoped<ITeamRepository, TeamRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment() || env.IsStaging())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "InterviewTime API v1");
                    c.RoutePrefix = string.Empty;
                });
            }

            if (env.IsStaging() || env.IsProduction())
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();

            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
