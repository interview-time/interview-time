import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import generatePicker from "antd/lib/date-picker/generatePicker";
import styled from "styled-components";

const DatePicker = styled(generatePicker(dateFnsGenerateConfig))`
  min-height: 44px;
`;

export default DatePicker;

// More details:
// https://ant.design/docs/react/replace-moment
// https://github.com/xiaohuoni/antd4-generate-picker
