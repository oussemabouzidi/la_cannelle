import { NextResponse, type NextRequest } from 'next/server';

const getBackendBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const forward = async (req: NextRequest) => {
  const backendUrl = `${getBackendBaseUrl()}/accessories${req.nextUrl.search}`;
  const method = req.method.toUpperCase();

  const headers = new Headers();
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);
  headers.set('content-type', 'application/json');

  const body = method === 'GET' || method === 'HEAD' ? undefined : await req.text();

  const response = await fetch(backendUrl, {
    method,
    headers,
    body
  });

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json'
    }
  });
};

export const GET = forward;
export const POST = forward;

