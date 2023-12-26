import env from '../env';
import { UpdateType } from '../default'
import { handleUpdateData } from './json_handler'

import moment from 'moment';


const deleteTask = async (
    task,
    updateType,
    taskRepo,
    repetitionRepo,
    loading,
    setLoading,
    datePointer
) => {
    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    var url = `http://${env.BACKEND_SERVER}/tasks/`;
    switch (updateType) {
        case UpdateType.ALL_TASKS:
        case UpdateType.FROM_ONE_TASK:
        case UpdateType.ONLY_ONE_TASK:
            var viewStart = moment(datePointer).add(-env.MAX_VIEW_RADIUS, 'days');
            var viewEnd = moment(datePointer).add(env.MAX_VIEW_RADIUS, 'days');

            url += `delete/g/${task.id}/?type=${updateType}&from=${viewStart.format('YYYY-MM-DD')}&to=${viewEnd.format('YYYY-MM-DD')}`;
            break;
        default:
            url += `delete/s/${task.id}/`;
    }

    if (!loading) setLoading(true);

    await fetch(url, {
        method: "DELETE",
        headers: {
            'Authorization': user.token
        }
    })
        .then(r => {
            if (r.ok) return r.json();
            console.log(r);
            throw new Error('Failed: DELETE TASK');
        })
        .then(json => handleUpdateData(json, taskRepo, repetitionRepo))
        .then(() => setLoading(false))
        .catch(e => console.log(e.message));

}

export default deleteTask;