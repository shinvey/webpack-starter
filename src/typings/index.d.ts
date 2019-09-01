// 在tsx官方定义的标签库上做扩展
// declare namespace JSX {
//   interface IntrinsicElements {
//     target: React.DetailedHTMLProps<
//       React.HTMLAttributes<HTMLElement>,
//       HTMLElement
//     >;
//     Component: React.DetailedHTMLProps<
//       React.HTMLAttributes<HTMLElement>,
//       HTMLElement
//     >;
//   }
// }

//允许ts,tsx文件引入less文件
declare module '*.less' {
  const styles: any
  export = styles
}

//允许ts,tsx文件引入less文件
declare module '*.scss' {
  const styles: any
  export = styles
}
