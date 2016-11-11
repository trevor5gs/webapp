import { fetchCredentials, parseJSON, checkStatus } from '../../../src/sagas/uploader'

const pretendAccessToken = 'pretendToken'

describe('fetchCredentials', function () {
  it('is pretty sweet', function () {
    const fetcher = fetchCredentials(pretendAccessToken)
    const mockCredentials = {
      credentials: {
        prefix: 'a prefix',
        endpoint: 'pretend-endpoint',
      },
    }
    const pretendCredentials = new Response(
      JSON.stringify(mockCredentials),
      {
        status: 200,
        statusText: 'Success!',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )

    const fetchArgs = [
      new RegExp('api/v2/assets/credentials'),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${pretendAccessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    ]
    // Mock the actual fetch
    expect(fetcher).to.call
      .with.fn(fetch)
      .and.args(...fetchArgs)

    expect(fetcher.next(pretendCredentials)).to.call(checkStatus, pretendCredentials)

    // parse the JSON
    expect(fetcher.next(mockCredentials))
      .to.call(parseJSON, pretendCredentials)

    return parseJSON(pretendCredentials).then(function (data) {
      expect(fetcher.next(data)).to.deep.return(mockCredentials)
    })
  })
})
