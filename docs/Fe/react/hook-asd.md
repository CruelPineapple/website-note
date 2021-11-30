# HOOK-ASD

函数组件没有完整的组件功能，例如没有状态等等，所以需要使用完全功能就需要使用类组件。但是类组件的代码比较麻烦，简单的功能也会让代码变得很大。

react希望开发者的组件尽量作为数据的管道，因此函数才是最佳的组件形式，HOOK就是为了加强函数组件，让函数组件也拥有完整的功能。

HOOK（钩子）意思就是需要什么功能，就用HOOK把外部的代码钩进来，可以使用react提供的几个常用钩子，也可以自己封装钩子，钩子一律使用use开头。这样就可以尽量让组件是函数了。

接下来将通过ASD项目学习HOOK

## useState

这个钩子让函数组件可以拥有状态。

我首先关注到了ASD中的Guide组件，它的UI就是一个问号图标 ❓ 功能也很简单，鼠标悬浮在❓ 上面的时候就显示引导信息。

这个组件原先是class组件，但是在学习了HOOK之后，我认为把它变为函数组件更符合它如此简单的功能。首先它需要有一个状态，记录鼠标是否悬浮在❓ 上，这个state应该是布尔类型。

```jsx
import React, { useState } from "react";
import pic from "../../assets/guide.png";
import "./Guide.css";

function Guide(){
  
  const [showGuide, setShowGuide] = useState(false)

  // ...
  
  return (
      <div className="guide">
      <img
        onMouseEnter={()=>setShowGuide(!showGuide)}
        onMouseLeave={()=>setShowGuide(!showGuide)}
        className="img"
        src={pic}
        alt=""
      ></img>
      <div>
				{/* Guide信息 */}
      </div>
    </div>
  )
}
```

引入useState的HOOK，它接受的参数是状态的初始值，这里是false，返回一对值，保存状态的变量和修改状态的函数，修改函数就接受这个状态的新值。在标签中为鼠标进入和离开事件设置回调函数，在回调函数内调用useState返回的修改函数。

这里插入一段关于绑定事件处理函数的要点：

1. useState提供的修改函数是不可以作为事件处理函数
2. 事件处理函数在xml中注册的时候只能传入函数名，不能带括号，更不能传参数，使用参数可以在定义事件处理方法的时候设置形式参数e（合成事件）
3. 类组件的处理函数需要在构造器中将this绑定到class实例上
4. 最简单的办法就是为事件监听绑定一个箭头函数，在箭头函数里面调用希望执行的方法，包括useState提供的修改函数

## 计算属性

Guide组件显示的引导信息是根据state来判断是否展示的，所以需要一个类似计算属性的东西来返回css类名

目前发现，useCallback，useMemo和直接使用函数都可以实现计算属性。

### useCallback

经过研究，useCallback返回的是一个函数，这个hook指定一个函数和一些依赖值，当依赖值发生变化就重新运行指定的函数并获取返回值。在设置className时，useCallback返回的函数需要被作为方法来调用，函数名后面跟上括号（一通废话）。貌似useCallback返回的方法是一个memorized的版本（我的理解是如果依赖不变，函数也不会变，而且相比普通函数，这种被memorized的函数可能会更快，参考turboFan），只有当依赖值发生变化时这个函数才会更新。

### useMemo

useMemo就不是返回函数了，它返回的是值，我感觉它更接近计算属性的感觉，因为用起来它就是一个值了。它也是传入一个函数和一些依赖值，当依赖值变化的时候重新计算出一个返回值，如果依赖不变，应该就会直接返回原先的那个值。

### 普通函数

当然也可以直接使用一个普通的函数来实现计算属性，它既不会是memorized函数也不会记忆返回值，我甚至怀疑每次re-render它都会被调用一次。好在react还是很聪明的，经过测试，不论是useCallback，useMemo还是普通的函数，它们都只会在依赖变化（对于普通函数来说就是state变化）的时候才会运行。

### state

经过这一番折腾，我感觉state中的数据是单向响应的，它们在变化的时候会通知依赖这些数据的组件进行更新，不然也解释不通普通函数实现的计算属性为什么只在state变化的时候运行了。

哈哈，文档说了，每次setState都会重新渲染组件。属于是重新发现新大陆了。

### 场景

useCallback和useMemo的使用场景估计不会是这种根据state来指定类名的，因为上面推测的单项响应性，普通函数就能干出一样的事儿了。它们二者的作用应该是用于依赖非响应性数据的情况，而且用法稍有区别，useCallback应该更关注函数执行的内容（但是这又有点像副作用了）而useMemo只关心返回值。

## 使用普通函数

最后使用了普通的函数作为需求的实现：

```jsx
function Guide(){

  const [showGuide, setShowGuide] = useState(false)


  function className(){
    if (showGuide) {
      return "show-guide";
    } else {
      return "hide-guide";
    }
  }

  return (
    <div className="guide-logo">
      <img
        onMouseEnter={()=>setShowGuide(!showGuide)}
        onMouseLeave={()=>setShowGuide(!showGuide)}
        className="img"
        src={pic}
        alt=""
      ></img>
      <div className={className()+' guide'}>
				{/* Guide信息 */}
      </div>
    </div>
  );
}
```

另外还修改了一下css类名的逻辑，原先控制显示和隐藏的两个类里面的样式重叠的非常多，真正和隐藏相关的逻辑只有opacity一个属性罢了，所以把这个属性抽出来单独控制，其余都留在固定不变的guide类里面了。在调试插件里面发现Guide插件重绘花费的时间平均缩短了零点几毫秒。

