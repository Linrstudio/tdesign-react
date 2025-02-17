import { TdUploadFile } from './types';

export function returnFileSize(number: number) {
  if (number < 1024) {
    return `${number} Bytes`;
  }
  if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  }
  if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

export function getCurrentDate() {
  const d = new Date();
  let month: string | number = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  return `${d.getFullYear()}-${month}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

/**
 * 缩略文件名 ABCDEFG => ABC...FG
 * @param inputName 文件名
 * @param leftCount 左边长度
 * @param rightcount 右边长度
 * @returns 缩略后的文件名
 */
export function abridgeName(inputName = '', leftCount = 5, rightcount = 7): string {
  const name = inputName;
  let leftLength = 0;
  let rightLength = 0;
  for (let i = 0; i < name.length; i++) {
    const w = name[i];
    const isCn = escape(w).indexOf('%u') === 0;
    if (i < leftCount * 2 && leftLength < leftCount) {
      isCn ? (leftLength += 1) : (leftLength += 2);
    } else if (i > i - rightcount && rightLength < rightcount) {
      isCn ? (rightLength += 1) : (rightLength += 2);
    }
  }
  return name.replace(new RegExp(`^(.{${leftLength}})(.+)(.{${rightLength}})$`), '$1…$3');
}

/**
 * 更新文件列表
 * @param {TdUploadFile} file 待操作文件
 * @param {TdUploadFile[]}fileList  已有文件列表
 * @param {boolean=false} deleteFile 是否删除文件
 */
export function updateFileList(file: TdUploadFile, fileList: TdUploadFile[], deleteFile = false) {
  const nextFileList = [...fileList];
  const fileIndex = nextFileList.findIndex(({ uid }: TdUploadFile) => uid === file.uid);
  if (deleteFile) {
    if (fileIndex !== -1) {
      nextFileList.splice(fileIndex, 1);
    }
  } else if (fileIndex === -1) {
    nextFileList.push(file);
  } else {
    nextFileList.splice(fileIndex, 1, file);
  }

  return nextFileList;
}

export const urlCreator = () => window.webkitURL || window.URL;

export function createFileURL(file: File) {
  return urlCreator()?.createObjectURL(file);
}

export function finishUpload(state) {
  return ['success', 'fail'].includes(state);
}

export function isSingleFile(multiple = false, theme: string) {
  return !multiple && ['file', 'file-input', 'image'].includes(theme);
}
