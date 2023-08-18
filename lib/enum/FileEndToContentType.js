/**
 * 
 * @param {String} fileName
 * @returns {String | null} 
 */
module.exports = (fileName) => {
  switch ("." + fileName.split(".")[fileName.split(".").length - 1]) {
    case ".pdf":    return  "application/pdf";
    case ".css":    return  "text/css";
    case ".js":     return  "application/javascript";
    case ".xml":    return  "application/xml";
    case ".doc":    return  "application/msword";
    case ".xls":    return  "application/vnd.ms-excel";
    case ".ppt":    return  "application/vnd.ms-powerpoint";
    case ".zip":    return  "application/zip";
    case ".mp3":    return  "audio/mpeg";
    case ".ogg":    return  "audio/ogg";
    case ".wav":    return  "audio/x-wav";
    case ".csv":    return  "text/csv";
    case ".html":   return  "text/html";
    case ".txt":    return  "text/plain";
    case ".bmp":    return  "image/bmp";
    case ".gif":    return  "image/gif";
    case ".jpg":    return  "image/jpeg";
    case ".jpeg":   return  "image/jpeg";
    case ".png":    return  "image/png";
    case ".mp4":    return  "video/mp4";
    case ".webm":   return  "video/webm";
    case ".swf":    return  "application/x-shockwave-flash";
    case ".tar":    return  "application/x-tar";
    case ".gz":     return  "application/x-gzip";
    case ".7z":     return  "application/x-7z-compressed";
    case ".rar":    return  "application/x-rar-compressed";
    case ".exe":    return  "application/octet-stream";
    case ".json":   return  "application/json";
    default: return null;
  }
}