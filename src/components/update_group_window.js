import "./update_group_window.css"
import { UpdateType } from '../default'

import { memo } from "react";

const UpdateForGroupWindow = (props) => {
    const { setUpdateTypeWindow, updateType, setUpdateType, handleSubmit } = props;

    const handleRadioEvent = (e) => {
        setUpdateType(e.target.value);
    }

    return (
        <div className="update-type-container"
            onMouseDown={e => {
                props.setUpdateTypeWindow(false);
                props.setUpdateType(undefined);
                e.stopPropagation();
            }}>
            <div className="update-type-edit"
                onMouseDown={e => e.stopPropagation()}>
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
                        onClick={() => {
                            handleSubmit();
                        }}>OK</button>
                </div>
            </div>
        </div>
    )
}

export default memo(UpdateForGroupWindow)