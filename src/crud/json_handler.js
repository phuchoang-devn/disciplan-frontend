export const getCircularReplacer = () => {
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

export const handleUpdateData = (json, tasks, repetitions) => {
  var repeRefClone = repetitions.current;
  var isChangedRepeNotNull = json.changed_repetition !== null;
  repeRefClone = repeRefClone.filter(repe => {
    return (repe.id !== json.deleted_repetition)
      && !(isChangedRepeNotNull && (repe.id === json.changed_repetition.id))
  })
  if (isChangedRepeNotNull) repeRefClone.push(json.changed_repetition);
  if (json.added_repetition !== null) repeRefClone.push(json.added_repetition);
  repetitions.current = repeRefClone;

  var listChangedTaskIds = json.changed_tasks.map(task => task.id);
  tasks.current = tasks.current.filter(task => 
    !(!!json.deleted_repetition && (task.repetition_group === json.deleted_repetition))
      && !json.deleted_tasks.includes(task.id)
      && !listChangedTaskIds.includes(task.id)
  )
  .concat(json.changed_tasks)
  .concat(json.added_tasks)
}

export const handleAddData = (json, tasks, repetitions) => {
  var repeRefClone = repetitions.current;
  if (json.repetition !== null) repeRefClone.push(json.repetition);
  repetitions.current = repeRefClone;

  tasks.current = json.tasks.concat(tasks.current);
}