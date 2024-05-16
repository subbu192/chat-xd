
export const verifyUser = async (jwtToken, userData) => {
    const res = await fetch('http://localhost:4000/auth/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jwtToken, userData })
    })
    return res.ok;
}