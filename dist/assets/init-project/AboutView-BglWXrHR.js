import{d as C,r as S,c as l,_ as v,u as _,s as d,o as p,a as i,b as o,t as c,e as b,F as g,p as k,f as x,g as I}from"./index-BfASziu-.js";const f=C("counter",()=>{const t=S(0),e=l(()=>t.value*2);function n(){t.value++}return{count:t,doubleCount:e,increment:n}}),h=t=>(k("data-v-6baf32d2"),t=t(),x(),t),j=h(()=>o("p",null,"bjsdbjbasj",-1)),B=h(()=>o("hr",null,null,-1)),N={__name:"about1",setup(t){const e=_(),n=f(),{count:u,doubleCount:a}=d(n);function s(){e.dispatch("addCounter")}return(r,m)=>(p(),i(g,null,[o("p",null,c(b(u)),1),j,B,o("button",{onClick:s},"增加")],64))}},T=v(N,[["__scopeId","data-v-6baf32d2"]]),V={class:"about"},$=o("h1",null,"This is an about page",-1),w=o("hr",null,null,-1),A={__name:"AboutView",setup(t){const e=f(),{count:n,doubleCount:u}=d(e),a=()=>{e.increment()},s=_(),r=l(()=>s.state.count);return(m,F)=>(p(),i("div",V,[$,o("p",null,"COUNT: "+c(b(n)),1),o("button",{onClick:a},"增加"),w,I(T),o("p",null,c(r.value),1)]))}};export{A as default};
