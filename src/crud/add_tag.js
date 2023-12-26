import env from '../env';

const addTag = async (
    data,
    setTagRepo,
    loading,
    setLoading,
    setCheckedTags
) => {
    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    if (!loading) setLoading(true);

    await fetch(`http://${env.BACKEND_SERVER}/tags/add/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            'Authorization': user.token
        },
        body: JSON.stringify(data)
    })
        .then(r => {
            if (r.ok) return r.json();
            console.log(r);
            throw new Error('Failed: ADD TAG');
        })
        .then(json => setCheckedTags(data => [...data, json.id]))
        .then(json => setTagRepo(data => [...data, json]))
        .then(() => setLoading(false))
        .catch(e => console.log(e.message));
}

export default addTag;