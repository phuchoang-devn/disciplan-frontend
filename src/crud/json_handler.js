export const handleData = (json, tasks, repetitions) => {
    var repeRefClone = repetitions.current;
    repeRefClone = repeRefClone.filter(repe => {
        if (repe.id === json.deleted_repetition) return
        if ((json.changed_repetition !== null) && (repe.id === json.changed_repetition.id)) return json.changed_repetition
    })
    if (json.added_repetition !== null) repeRefClone = repeRefClone.push(json.added_repetition);
    repetitions.current = repeRefClone;

    var listChangedTaskIds = json.changed_tasks.map(task => task.id);
    tasks.current = tasks.current.filter(task => {
        if (task.repetition_group === json.deleted_repetition) return
        if (json.deleted_tasks.includes(task.id)) return
        if (listChangedTaskIds.includes(task.id)) return
    })
        .concat(json.changed_tasks)
        .concat(json.added_tasks);
}