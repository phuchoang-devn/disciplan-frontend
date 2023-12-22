import "./update_type.css"
import { UpdateType } from '../default'

import { memo } from "react";

const UpdateForGroup = (props) => {
    const { setUpdateTypeWindow, updateType, setUpdateType, handleSubmit, setTaskEdit } = props;

    const handleRadioEvent = (e) => {
        setUpdateType(e.target.value);
    }

    return (
        <div className="update-type-container"
            onClick={e => {
                props.setUpdateTypeWindow(false);
                e.stopPropagation();
            }}>
            <div className="update-type-edit"
                onClick={e => e.stopPropagation()}>
                <span className="update-type__title"><b>Apply on...</b></span>
                <div>
                    <div className="update-type__input-container">
                        <input
                            type="radio"
                            name="uType"
                            value={UpdateType.ONLY_ONE_TASK}
                            onChange={e => handleRadioEvent(e)}
                            checked={updateType === UpdateType.ONLY_ONE_TASK} />
                        <span>Only This Task</span>
                    </div>
                    <div className="update-type__input-container">
                        <input
                            type="radio"
                            name="uType"
                            value={UpdateType.FROM_ONE_TASK}
                            onChange={e => handleRadioEvent(e)}
                            checked={updateType === UpdateType.FROM_ONE_TASK} />
                        <span>This Task and All behind</span>
                    </div>
                    <div className="update-type__input-container">
                        <input
                            type="radio"
                            name="uType"
                            value={UpdateType.ALL_TASKS}
                            onChange={e => handleRadioEvent(e)}
                            checked={updateType === UpdateType.ALL_TASKS} />
                        <span>All Task</span>
                    </div>
                </div>
                <div className="update-type__btn-group">
                    <button
                        className="update-type__btn update-type__btn-x"
                        onClick={() => {
                            setUpdateType(undefined)
                            setUpdateTypeWindow(false);
                        }}>Cancel</button>
                    <button
                        className="update-type__btn update-type__btn-o"
                        onClick={() =>{
                            setTaskEdit(undefined);
                            handleSubmit();
                        }}>OK</button>
                </div>
            </div>
        </div>
    )
}

export default memo(UpdateForGroup)