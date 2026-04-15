"use server"

export async function signup (formData: FormData) {
    for (const [key, value] of formData.entries()) console.log(key,value);
}