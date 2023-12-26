import env from '../env';
import { getCircularReplacer, handleAddData } from './json_handler'

import moment from 'moment';


const addTask = async (
    data,
    taskRepo,
    repetitionRepo,
    loading,
    setLoading,
    datePointer
) => {
    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    var url = `http://${env.BACKEND_SERVER}/tasks/`;
    var body;

    if (!!data.repetition) {
        var viewStart = moment(datePointer).add(-env.MAX_VIEW_RADIUS, 'days');
        var viewEnd = moment(datePointer).add(env.MAX_VIEW_RADIUS, 'days');
        url += `add/g/?from=${viewStart.format('YYYY-MM-DD')}&to=${viewEnd.format('YYYY-MM-DD')}`;
        body = {
            task_in: data.info,
            repetition_in: data.repetition
        };
    } else {
        url += "add/s/";
        body = data.info;
    }
    
    if (!loading) setLoading(true);

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            'Authorization': user.token
        },
        body: JSON.stringify(body, getCircularReplacer())
    })
        .then(r => {
            if (r.ok) return r.json();
            console.log(r);
            throw new Error('Failed: ADD TASK');
        })
        .then(json => handleAddData(json, taskRepo, repetitionRepo))
        .then(() => setLoading(false))
        .catch(e => console.log(e.message));

}

export default addTask;