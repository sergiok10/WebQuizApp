/*******************************Login User **************************************/
const loginUser = async (email, password) => {
    if(!email || !password){
        throw Error('All fields are required');
    }

    const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    });

    const data = await res.json();

    if(!res.ok){
        throw Error(data.error);
    }

    return data;
}


/*******************************Register Function **************************************/
const registerUser = async (email, password, passwordConfirm) => {
    if(!email || !password || !passwordConfirm){
        throw Error("All fields are required");
    }

    if(password !== passwordConfirm){
        throw Error("Passwords do not match");
    }

    const res = await fetch('/api/users/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })


    const data = await res.json();

    if(!res.ok){
        throw Error(data.error);
    }

    return data;
}

const updateHighscore = async (quizId, score) => {
    const res = await fetch('/api/users/update-highscore', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
         },
        body: JSON.stringify({ quizId, score }),
    });
    const data = await res.json();

    if (!res.ok) {
        throw Error(data.error);
    }

    return data;
}

export { loginUser, registerUser, updateHighscore };