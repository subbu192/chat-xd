import { verifyUser } from './libs/auth';

export async function middleware(request) {
    const jwtToken = request.cookies.has('jwt') ? request.cookies.get('jwt').value : 'empty';
    const userData = request.cookies.has('userData') ? request.cookies.get('userData').value : '';

    const verified = await verifyUser(jwtToken, userData);

    if (request.nextUrl.pathname == '/' || (request.nextUrl.pathname.startsWith('/auth') && !verified)) {  
        return;
    }

    if (verified) {
        if (request.nextUrl.pathname.startsWith('/auth')) {
            return Response.redirect(new URL('/', request.url));
        } else {
            return;
        }
    } else {
        return Response.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}