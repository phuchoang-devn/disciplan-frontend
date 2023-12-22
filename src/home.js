import './home.css';
import env from './env';
import TaskInfo from "./components/home_task_info";
import TaskEdit from "./components/home_task_edit";

import moment from 'moment';
import { useState, useEffect, useRef, createContext, useMemo, memo } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export const TaskContext = createContext();

const Home = (props) => {
    const { loggedIn, email } = props

    const [datePointer, setDatePointer] = useState(new Date());
    const tasks = useRef([]);
    const repetitions = useRef([]);
    const [tags, setTags] = useState([]);
    const defaultColor = useRef({});

    const appStartPoint = useMemo(() => new Date(), []);
    const fetchedDates = useRef([]);

    const [viewRender, setViewRender] = useState("");

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [taskInfo, setTaskInfo] = useState(NaN);
    const [taskEdit, setTaskEdit] = useState(undefined);

    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    useEffect(() => {
        if (!loggedIn || !user) {
            navigate("/login");
            return
        }
        getAllTags();
        getDefaultColor();
    }, [loggedIn])

    useEffect(() => {
        if (!loggedIn || !user) return

        let diff = moment(datePointer).diff(moment(appStartPoint), 'days');
        let start = ((diff > 0) ? diff + 1 : diff) - env.MAX_VIEW_RADIUS;
        let fetchLength = 2 * env.MAX_VIEW_RADIUS + 1;
        let calcToFetch = Array.from({ length: fetchLength }, (_, i) => i + start);
        let arrDiff = calcToFetch.filter(x => !fetchedDates.current.includes(x));

        if (arrDiff.length !== 0) {
            getTasks(
                moment(datePointer).add(Math.min(...arrDiff), 'days'),
                moment(datePointer).add(Math.max(...arrDiff), 'days'),
                arrDiff
            );
        }
    }, [datePointer])

    const logOut = () => {
        localStorage.removeItem("disciplan_user");
        props.setLoggedIn(false);
        sessionStorage.clear();
        navigate("/login");
    }

    const getDefaultColor = async () => {
        await fetch("http://" + env.BACKEND_SERVER + "/users/default-color", {
            headers: {
                'Authorization': user.token
            }
        })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error('Failed: GET default color');
            })
            .then(json => defaultColor.current = json)
            .catch(e => console.log(e.message));
    }

    const getAllTags = async () => {
        await fetch("http://" + env.BACKEND_SERVER + "/tags/all", {
            headers: {
                'Authorization': user.token
            }
        })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error('Failed: GET all tags');
            })
            .then(json => setTags(json))
            .catch(e => console.log(e.message));
    }

    const getTasks = async (viewStart, viewEnd, newData) => {
        let url = "http://" + env.BACKEND_SERVER + "/tasks/period/?from=" +
            viewStart.format('YYYY-MM-DD') + "&to=" + viewEnd.format('YYYY-MM-DD');
        if (!loading) setLoading(true)
        await fetch(url, {
            headers: {
                'Authorization': user.token
            }
        })
            .then(r => {
                if (r.ok) {
                    fetchedDates.current = [...fetchedDates.current, ...newData];
                    return r.json();
                }
                throw new Error('Failed: GET TASKS');
            })
            .then(json => {
                tasks.current = tasks.current.concat(json.tasks);
                repetitions.current = repetitions.current.concat(json.repetitions);
            }).then(() => setLoading(false))
            .catch(e => console.log(e.message));
    }

    const todayBtn = () => {
        if (moment(datePointer).format('YYYY-MM-DD') !== moment(new Date()).format('YYYY-MM-DD'))
            setDatePointer(new Date());
    }

    const HomeDropDown = (props) => {
        return (
            <div className='home-dropdown'>
                <div className='home-nav-btn'><b>{props.btn_name}</b></div>
                <div className="home_dropdown-content">
                    {props.link_content.map(
                        ([k, v]) => (<Link key={k} to={v}>{k}</Link>)
                    )}
                    {props.btn_content.map(
                        ([k, v]) => (<div key={k} onClick={v}>{k}</div>)
                    )}
                </div>
            </div>
        )
    }

    const WaitingMessage = (props) => {
        if (props.loading)
            return (
                <div className='home-waiting'></div>
            )
        return
    }

    return (
        <div className='home-container'>
            <WaitingMessage loading={loading} />
            <div className="home-nav">
                <span className='home-nav__brand'>Disciplan</span>
                <div className='home-nav__button-group'>
                    <div className='home-view'><b>{viewRender}</b></div>
                    <div type="button"
                        className='home-nav-btn'
                        onClick={todayBtn}>
                        <b>Today</b>
                    </div>

                    <HomeDropDown
                        btn_name="View"
                        link_content={[
                            ["Day", "/day"],
                            ["Week", "/week"],
                            ["Month", "/month"],
                            ["Year", "/year"],
                            ["Tasks", "/tasks"],
                        ]}
                        btn_content={[]}
                    />
                </div>
                <HomeDropDown
                    btn_name={email}
                    link_content={[
                        ["Settings", "1"],
                    ]}
                    btn_content={[
                        ["Logout", logOut]
                    ]}
                />
            </div>
            <TaskContext.Provider value={[tasks, repetitions, setTaskInfo, setTaskEdit, loading, setLoading, datePointer]}>
                {
                    (!isNaN(taskInfo)) ?
                        <TaskInfo
                            id={taskInfo} />
                        : null
                }
                {
                    taskEdit ?
                        <TaskEdit
                            taskEdit={taskEdit}
                            tags={tags}
                            defColor={defaultColor}
                            loading={loading}
                            setloading={setLoading} />
                        : null
                }
                <Outlet context={[
                    datePointer,
                    tasks,
                    repetitions,
                    loading,
                    setDatePointer,
                    setViewRender
                ]} />
            </TaskContext.Provider>
        </div>
    )
}

export default memo(Home);