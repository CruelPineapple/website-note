# Array.unshift()实现可选picker

最近在开发字节小程序的时候涉及到许多multipicker选择器，也就是多列picker。这些选择器大多需要后台传输选项内容。但是，**picker似乎没有缺省值**，也就是说，没有一个空值选项。当然我们可以通过给picker控制的index数组赋一个值来代表缺省值，然而每当用户不小心点到了picker，缺省值就会被替换为picker选中的值。此时用户是无法选择一个空选项的。

#### 看看我是怎么做的

首先接收到后台传入的picker选项数组：

叫final是因为之前还有一个去除json转义的步骤，网上抄的，使用eval完成字符串到对象的转换：

:::	warning

微信小程序不支持eval()，转换还需另想办法  
最新发现：飞书小程序也不支持（只是调试工具恰巧能运行eval）

:::

```
            let row=res.data.data;
            let reg=/\\/g;
            let replaced=row.replace(reg,'');
            //console.log(replaced);
            //console.log('final',eval('(' + replaced + ')'));
            let finalArr=eval('(' + replaced + ')');
```

```
 finalArr = [
	['第一列第一个', '第一列第二个'],//0
  	[// 1
		['第一列第一个的第二列第一个', '第一列第一个的第二列第二个'],
		['第一列第二个的第二列第一个'，‘第一列第二个的第二列第二个]
  ],
];
```

然后生成picker显示默认值的数组：

```
            let dataArr=[];
            dataArr[0]=finalArr[0];
            dataArr[1]=finalArr[1][0];
         //   dataArr=[
         //		['第一列第一个', '第一列第二个'],
         //		['第一列第一个的第二列第一个', '第一列第一个的第二列第二个']
         // ]
```

接下来复制一份dataArr（因为必选的picker可以直接使用dataArr，而我们做的处理都是为了可选的picker），并使用Array.unshift()在数组头部添加元素。

```
            let dataArr1=JSON.parse(JSON.stringify(dataArr));
            dataArr1[0].unshift("可选");
            dataArr1[1]=[];
```

这时候picker的默认显示数组变成了：

```
            dataArr=[
         		['可选','第一列第一个', '第一列第二个'],
         		[]
          	]
```

同样的方法处理picker的完整选项数组：

```
            let finalArr1=JSON.parse(JSON.stringify(finalArr));
            finalArr1[0].unshift("可选");
            finalArr1[1].unshift([]);
        //  finalArr = [
		//			['可选','第一列第一个', '第一列第二个'],//0
  		//		[// 1
  		//			[],
		//			['第一列第一个的第二列第一个', '第一列第一个的第二列第二个'],
		//			['第一列第二个的第二列第一个'，‘第一列第二个的第二列第二个]
  		//		],
		//	];
```

这时候picker默认的时候就会处于一个可选的状态了，之后获取到picker的值传输给后台前，将pickerValue数组的第一个元素减去1即是原始picker数据的对应index。