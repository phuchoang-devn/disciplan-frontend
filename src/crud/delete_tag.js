import env from '../env';

const deleteTag = async (
    id,
    setTagRepo,
    loading,
    setLoading
) => {
    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    if (!loading) setLoading(true);

    await fetch(`http://${env.BACKEND_SERVER}/tags/delete/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': user.token
        },
    })
        .then(r => {
            if (r.ok) setTagRepo(data => data.filter(tag => tag.id !== id));
            else {
                console.log(r);
                throw new Error('Failed: DELETE TAG');
            }
        })
        .then(() => setLoading(false))
        .catch(e => console.log(e.message));
}

export default deleteTag;