const U = {
  /**
   * 由 键值(value) 读取出 与之对应的 键名（key）
   * value:键值
   * array: 查询的数组/对象
   */
  getKey:function(value,array){
    for (var key in array) {
      if (array[key] == value) {
        return key;
        break;
      }
    }
    return false;
    // array.map(function (item, index, arr) {
    //   if (item == value){
    //     return key;
    //     break;
    //   }
    // });
  },
  /**
   * 判断对象是否为空对象
   * obj;var obj = {};
   */
  isEmptyObject: function (obj){
    for (var key in obj) {
      return false;
    }
    return true;
  },
};
module.exports = U;