# HTTP header转换为js对象

```js
/**
 * --- 题目描述 ---
 *
 * 实现一个方法，把 HTTP 文本形式(字符串)的 header 转换成 JS 对象。
 * 
 * --- 测试用例 ---
 * 
 * 输入：
 * `Accept-Ranges: bytes 
 * Cache-Control: max-age=6000, public
 * Connection: keep-alive
 * Content-Type: application/javascript`
 * 输出：
 * {
 *   "Accept-Ranges": "bytes",
 *   "Cache-Control": "max-age=6000, public",
 *   Connection: "keep-alive",
 *   "Content-Type": "application/javascript"
 * }
 *
 * --- 解题思路 ---
 *
 * 1. 首先将每行数据作为数组的一个元素
 * 2. 将每个元素使用冒号分割，前面为 `key`，后面为 `value`。
 */

const solution = (s) => {
    let res = {};
    let arr = s.split("\n");
    arr.forEach((e) => {
        let tmp = e.split(": ");
        res[tmp[0]] = tmp[1];
    })
    return res;
}
```

比较简单的处理，用换行分割字符串，然后对每行用：分割，得到key和value，放入对象中。

原文这里提到了，输出对象中Connection属性是没有引号的，而其他的属性则是带有引号。经过研究，是因为其他key中含有-字符，属于不能使用点操作的属性，因为杠杠在用点操作的时候js会误会成减号。**推测：在展示不可以用点操作的属性时就会使用引号**。空格分割的多字属性也是类似的，会在展示的时候用引号。