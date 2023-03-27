const messages = {
  LOGIN_SUCCESS: "Login success",
  LOGIN_ERROR: "Login failed, please try again !",
  SESSION_EXPIRE: "Your session has expired. Please login again.",
  PERMISSION_DENIED: "You don't have permission to do this action",
  TITLE_PERMISSION_DENIED: "Sorry, you are not authorized to access this page.",
  LEAVE: "Are you sure you want to leave? Unsaved changes may be lost",
  PAGE_NOT_FOUND: "Sorry, the page you looking for does not exist.",
  CHANGE_SERVICE_ME:
    "Change of Service URL will lead to deletion of related configuration. Do you still want to change ?",
  ENTER_ALL_REQUIRED_LANGUAGE_FIELDS:
    "You must enter both languages of the required information",
  CREATE_SUCCESS: (text: string) => `Create ${text} successfully`,
  CREATE_FAILED: (text: string) => `Create ${text} failed`,
  EDIT_SUCCESS: (text: string) => `Edit ${text} successfully`,
  EDIT_FAILED: (text: string) => `Edit ${text} failed`,
  DELETE_SUCCESS: (text: string) => `Delete ${text} successfully`,
  DELETE_FAILED: (text: string) => `Delete ${text} failed`,
  IMPORT_SUCCESS: (text: string) => `Import ${text} successfully`,
  IMPORT_FAILED: (text: string) => `Import ${text} failed`,
  EXPORT_FAILED: (text: string) => `Export ${text} failed`,
  EXISTED: (text: string) => `${text} already exists`,
  NOT_EXIST: (text: string) => `This ${text} does not exist`,
  CONFIRM_DELETE: (text: string) => `Are you sure to delete this ${text}?`,
  GET_DETAIL_FAILED: (text: string) => `Get ${text} detail failed`,
  HAS_BEEN_USED: (text: string) => `${text} has already been used`,
  INACTIVE: (text: string) => `${text} is inactive`,
  WRONG_FORMAT: (text: string) => `Wrong format of ${text}`,
  NOT_FOUND: (text: string) => `${text} is not found`,
  DUPLICATE_ENTITY: (text: string) => `${text} already exists`,
  ALREADY_USED_ELSEWHERE: (text: string) => `${text} is already used elsewhere`,
  ARGUMENT_NOT_VALID: "There is something wrong with your input.",
  EXCEPTION: `Something went wrong. Please try again later`
};

export default messages;
