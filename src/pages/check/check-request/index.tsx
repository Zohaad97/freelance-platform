import { Button, Stack } from '@mui/material'
import { useState } from 'react'

import { rawClient, client } from '@/utils/client'

export default function CheckRequest(): RC {
  const [result, setResult] = useState('(无)')

  const requestBaidu = () => {
    rawClient.get('/test-devserver-baidu').then(res => {
      setResult(res.data)
    })
  }

  const nativeError = () => {
    setResult('(无)')
    client.get('https://www.baidu.com/').catch(err => {
      setResult('错误！！ ' + JSON.stringify(err))
    })
  }

  const responseError = () => {
    setResult('(无)')
    client.get('/paperplane/api/xxx', { baseURL: '' }).catch(err => {
      setResult('错误！！' + JSON.stringify(err))
    })
  }

  const bizError = () => {
    setResult('(无)')
    client.get('/paperplane/api/git-helper/project/xxx', { baseURL: '' }).catch(err => {
      setResult('错误！！' + JSON.stringify(err))
    })
  }

  const requestOK = () => {
    setResult('(无)')
    client.get('/paperplane/api/git-helper/project', { baseURL: '' }).then(data => {
      setResult(JSON.stringify(data))
    })
  }

  return (
    <div>
      <p>request 测试页面（测试 devServer 配置是否生效，以及 changeOrigin、全局错误处理）</p>

      <Stack spacing={2} width={300}>
        <Button variant="contained" onClick={requestBaidu}>
          测试 devServer（请求百度）
        </Button>

        <Button variant="contained" onClick={nativeError}>
          测试 request 原生报错
        </Button>

        <Button variant="contained" onClick={responseError}>
          测试请求报错（40x 或者 50x 错误码）
        </Button>

        <Button variant="contained" onClick={bizError}>
          测试业务报错（success: false）
        </Button>

        <Button variant="contained" onClick={requestOK}>
          测试成功的请求
        </Button>
      </Stack>

      <p>结果：{result}</p>
    </div>
  )
}
