/// <reference lib="webworker" />
const xhrs: Array<XMLHttpRequest> = [];

addEventListener('message', ({ data }) => {
  
  const {filename, content} = data;
  forwardHttpReq(filename, content);
});

const forwardHttpReq = (filename:any, content:any) =>{
  let forward: any = {};

  const current = new XMLHttpRequest();
  current.open('POST', 'http://localhost:3040/api/v1/nft/upload', true);
  current.setRequestHeader('Content-type', 'application/json');
  xhrs.push(current);

  current.onreadystatechange =() =>{
    console.log(current);
    if (current.readyState === 4) {
      if (current.status === 200) {
        postMessage({
          topic: `${filename}-uploaded`,
          message: {
            url: current.response
          }
        });
      }}
  }



  forward.filename = filename;
  forward.content = content;
  
  current.send(JSON.stringify(forward));
}
