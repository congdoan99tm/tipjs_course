import CustomError from '../core/custom.error';
import { BadRequestError } from '../core/error.response';
import templateModel from '../models/template.model';
import { htmlEmailToken } from '../utils/tem.html';

const newTemplate = async ({ tem_name }) => {
  // 1. check if template exists

  // 2. create a new template

  const newTem = await templateModel.create({
    tem_name, // unique name
    tem_html: htmlEmailToken,
  });
  return newTem;
};

const getTemplate = async (tem_name) => {
  const template = await templateModel.findOne({ tem_name });
  return template;
};
export default { newTemplate, getTemplate };
