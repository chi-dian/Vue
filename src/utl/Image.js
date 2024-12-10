export function base64ToImage(base64String) {
  // 创建一个新的Image对象
  var img = new Image();

  // 设置Image对象的src属性为base64字符串
  img.src = base64String;

  // 将Image对象添加到body的末尾，这样它就会被显示出来
  document.body.appendChild(img);

  // 返回Image对象，以便可以进一步操作（例如设置样式或事件监听）
  return img;
}
