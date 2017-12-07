let jsonSchema = {
  type : "boolean",
  defaultValue: false,
  allowsNull: false,
  format: {
    true: 1,
    false: 0
  }
};
export default jsonSchema;