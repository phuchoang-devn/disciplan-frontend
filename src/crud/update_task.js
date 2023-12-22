import env from '../env';
import { UpdateType } from '../default'
import { handleData } from './json_handler'

import moment from 'moment';

const updateTask = (
    task,
    data,
    updateType,
    tasks,
    repetitions,
    loading,
    setLoading,
    datePointer
    ) => {
    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    const updateInfo = async (viewStart, viewEnd) => {
        var url = `http://${env.BACKEND_SERVER}/tasks/`;
        switch (updateType) {
            case UpdateType.ALL_TASKS:
            case UpdateType.FROM_ONE_TASK:
            case UpdateType.ONLY_ONE_TASK:
                url += `update/g/${task.id}/?type=${updateType}&`;
                break;
            default:
                url += `update/s/${task.id}/?`;
        }
        url += `from=${viewStart.format('YYYY-MM-DD')}&to=${viewEnd.format('YYYY-MM-DD')}`;

        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': user.token
            },
            body: JSON.stringify(data.info, getCircularReplacer())
        })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error('Failed: UPDATE INFO');
            })
            .then(json => handleData(json, tasks, repetitions))
            .catch(e => console.log(e.message));
    }

    const updateOrAddRepe = async (viewStart, viewEnd) => {
        var url = `http://${env.BACKEND_SERVER}/tasks/`;
        if (!task.repetition_group) {
            url += `add/r/${task.id}/`
        } else url += `update/r/${task.id}/`
        url += `?from=${viewStart.format('YYYY-MM-DD')}&to=${viewEnd.format('YYYY-MM-DD')}`;

        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': user.token
            },
            body: JSON.stringify(data.repetition)
        })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error('Failed: UPDATE INFO');
            })
            .then(json => handleData(json, tasks, repetitions))
            .catch(e => console.log(e.message));
    }

    if (!loading) setLoading(true)

    var viewStart = moment(datePointer).add(-env.MAX_VIEW_RADIUS, 'days');
    var viewEnd = moment(datePointer).add(env.MAX_VIEW_RADIUS, 'days');

    (async (start, end) => {
        if (data.repetition !== null) await updateOrAddRepe(start, end);
        if (data.info !== null) await updateInfo(start, end);
    })(viewStart, viewEnd)
        .then(() => setLoading(false));
}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

export default updateTask;