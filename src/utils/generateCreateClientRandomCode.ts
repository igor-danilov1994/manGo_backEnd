export const generateCreateClientRandomCode = (type: 'letters' | 'numbers' ,length: number) =>  {
    let characters = '';

    if (type === 'letters') {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } else if (type === 'numbers') {
        characters = '0123456789';
    } else {
        throw new Error('Invalid type. Use "letters" or "numbers".');
    }

    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

