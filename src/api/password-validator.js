import zxcvbn from 'zxcvbn';

export function checkPasswordSecurity(password) {

    const result = zxcvbn(password);
    let score = '';

    switch (result.score) {
        case 0:
            score = 'veryWeak';
            break;
        case 1:
            score = 'weak';
            break;
        case 2:
            score = 'medium';
            break;
        case 3:
            score = 'strong';
            break;
        case 4:
            score = 'veryStrong';
            break;
        default:
            score = '';
            break;
    }

    return score;
};