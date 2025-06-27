import md5 from 'blueimp-md5';

export default function getGravatarUrl(email) {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = md5(trimmedEmail);
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}