import env from '../env';

const updateTag = async (
    tagId,
    data,
    setTagRepo,
    loading,
    setLoading
) => {
    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    if (!loading) setLoading(true);

    await fetch(`http://${env.BACKEND_SERVER}/tags/update/${tagId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            'Authorization': user.token
        },
        body: JSON.stringify(data)
    })
        .then(r => {
            if (r.ok) return r.json();
            else {
                console.log(r);
                throw new Error('Failed: UPDATE TAG');
            }
        })
        .then(json => setTagRepo(repo => [...repo.filter(tag => tag.id !== tagId), json]))
        .then(() => setLoading(false))
        .catch(e => console.log(e.message));
}

export default updateTag;