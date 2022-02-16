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
                                                 "https://app.interviewer.space")
                                                .SetIsOriginAllowedToAllowWildcardSubdomains()
                                                .AllowAnyHeader()
                                                .AllowAnyMethod()
                                                .AllowCredentials();
                                         });
                   });

            services.AddControllers()
                .AddFluentValidation(fv =>
                    fv.RegisterValidatorsFromAssemblyContaining<ChangeMemberRoleRequestValidator>());

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CAF API", Version = "v1" });
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
                RegionEndpoint = RegionEndpoint.GetBySystemName("ap-southeast-2"),
                UseAccelerateEndpoint = true
            };

            services.AddSendGrid(options =>
            {
                options.ApiKey = Configuration["SendGridApiKey"];
            });

            services.AddSingleton<IAmazonS3>(new AmazonS3Client(s3Config));

            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<ITemplateService, TemplateService>();
            services.AddSingleton<IInterviewService, InterviewService>();
            services.AddSingleton<ITeamService, TeamService>();
            services.AddSingleton<ICandidateService, CandidateService>();
            services.AddSingleton<IAuthorizationHandler, IsAdminAuthorizationHandler>();
            services.AddSingleton<IEmailService, EmailService>();
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
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CAF API v1");
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
