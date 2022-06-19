import { Col, Form, Input, Row, Select } from "antd";
import TitleBack from "../../components/title/title-back";
import Text from "antd/lib/typography/Text";
import TemplateImage from "../../components/template-card/template-image";
import { filterOptionLabel } from "../../utils/filters";
import Card from "../../components/card/card";
import React from "react";
import { TemplateCategories } from "../../utils/constants";

/**
 *
 * @param {string} templateType
 * @param {function} onBackClicked
 * @param {function}onTitleChange
 * @param {function} onCategoryChange
 * @param {function} onDescriptionChange
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateMetaCard = ({
    templateType,
    onBackClicked,
    onTitleChange,
    onCategoryChange,
    onDescriptionChange
}) => {

    const templateCategories = TemplateCategories.map(category => ({
        value: category.key,
        label: category.title,
    }));

  return <Card>
      <Row gutter={[32, 32]} wrap={false}>
          <Col flex='auto'>
              <div style={{ marginBottom: 16 }}>
                  <TitleBack title="Interview Template" onBackClicked={onBackClicked} />
              </div>
              <Text type='secondary'>
                  Enter template detail information so you can easily discover it among other
                  templates.
              </Text>
          </Col>
          <Col>
              <TemplateImage templateType={templateType} />
          </Col>
      </Row>
      <Row gutter={[32, 32]} style={{marginTop: 16}}>
          <Col span={12}>
              <Form.Item
                  name='title'
                  label={<Text strong>Title</Text>}
                  rules={[
                      {
                          required: true,
                          message: "Please enter template-edit title",
                      },
                  ]}
              >
                  <Input placeholder='e.g. Android' onChange={onTitleChange} />
              </Form.Item>
          </Col>
          <Col span={12}>
              <Form.Item
                  name='category'
                  label={<Text strong>Category</Text>}
                  rules={[
                      {
                          required: true,
                          message: "Please choose template-edit category",
                      },
                  ]}
              >
                  <Select
                      style={{ width: "100%" }}
                      placeholder='Select category'
                      onSelect={onCategoryChange}
                      options={templateCategories}
                      showSearch
                      filterOption={filterOptionLabel}
                  />
              </Form.Item>
          </Col>
      </Row>

      <Row gutter={[32, 32]}>
          <Col span={12}>
              <Form.Item name='description' label={<Text strong>Description</Text>}>
                  <Input
                      placeholder='e.g. Entry-level software engineer'
                      onChange={onDescriptionChange}
                  />
              </Form.Item>
          </Col>
      </Row>
  </Card>
}

export default TemplateMetaCard