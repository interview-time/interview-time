import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import generatePicker from "antd/lib/date-picker/generatePicker";

const DatePicker = generatePicker(dateFnsGenerateConfig);

export default DatePicker;

// More details:
// https://ant.design/docs/react/replace-moment
// https://github.com/xiaohuoni/antd4-generate-picker
