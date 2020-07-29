import React, { useState, useEffect } from 'react';
import axios from "axios";
const OSS = require('ali-oss');
class Example extends React.Component {
  state = {
    count: 0,
    keyObject: {},
    upfile: "",
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    let that = this;
    axios.get('/smart/fetchALiYunOssToken')
      .then(function (response) {
        console.log(response);
        let { status, data } = response;
        if (status == 200) {
          that.setState({
            keyObject: data
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleUpload() {
    let { keyObject, upfile } = this.state;
    var fileObj = document.getElementById("file").files[0];
    console.log(fileObj);
    console.log(keyObject);
    let ossConfig = {
      region: 'oss-cn-hangzhou',
      //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
      accessKeyId: keyObject.AccessKeyId,
      accessKeySecret: keyObject.AccessKeySecret,
      stsToken: keyObject.SecurityToken,
      bucket: 'wesmart-app'
    }
    let client = new OSS({
      region: 'oss-cn-hangzhou',
      //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
      accessKeyId: keyObject.AccessKeyId,
      accessKeySecret: keyObject.AccessKeySecret,
      stsToken: keyObject.SecurityToken,
      bucket: 'wesmart-app'
    });

    let tempCheckpoint;

    // 定义上传方法。
    async function multipartUpload() {
      try {
        // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        let result = await client.multipartUpload('02', fileObj, {
          progress: function (p, checkpoint) {
            // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
            tempCheckpoint = checkpoint;
            console.log(p);
            console.log(checkpoint);
          },
          mime: 'video/mp4'
        })
      } catch (e) {
        console.log(e);
      }
    }

    // 开始分片上传。
    multipartUpload();

    // 暂停分片上传。
    client.cancel();

    // 恢复上传。
    let resumeclient = new OSS(ossConfig);
    async function resumeUpload() {
      try {
        let result = await resumeclient.multipartUpload('02', fileObj, {
          progress: function (p, checkpoint) {
            tempCheckpoint = checkpoint;
            console.log(p);
            console.log(checkpoint);
          },
          checkpoint: tempCheckpoint,
          mime: 'video/mp4'
        })
      } catch (e) {
        console.log(e);
      }
    }
    resumeUpload();
  }

  handleChange(e) {
    e.persist();
    this.setState({ upfile: e.target.value });
  }

  render() {
    const { upfile } = this.state;
    return (
      <div>
        <script type="text/javascript" src="http://gosspublic.alicdn.com/aliyun-oss-sdk-x.x.x.min.js"></script>
        <p><input id="file" type="file" onChange={this.handleChange.bind(this)} value={upfile} /></p>
        <button onClick={this.handleUpload.bind(this)}>
          上传
        </button>
      </div>
    )
  }

}


// function Example() {
//   // 声明一个叫 "count" 的 state 变量
//   const [count, setCount] = useState(0);

//   function getData() {
//     axios.get('/system/smart/fetchALiYunOssToken')
//       .then(function (response) {
//         console.log(response);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }
//   useEffect(() => {
//     getData();

//   });


//   return (
//     <div>
//       <p>count： {count} </p>
//       <button onClick={() => setCount(count + 2)}>
//         点击
//       </button>
//     </div>
//   );
// }


export default Example;