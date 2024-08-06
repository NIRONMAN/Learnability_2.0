"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Button, Avatar, Dropdown, Select, message, MenuItemProps, MenuProps } from 'antd';
import {SunOutlined ,MoonOutlined , LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ProfileOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { setSessions } from '@/app/GlobalRedux/Features/sessions/sessionsSlice';
import { createSession, getSession, getUserSessions } from '@/utils/functions';
import { setOnLearn } from '../GlobalRedux/Features/string/stringSlice';
import { clearUser } from '../GlobalRedux/Features/auth/authSlice';
import Logo from '../Components/Logo';
import { setDark, setLight } from "@/app/GlobalRedux/Features/colours/coloursSlice";
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '../Components/ThemeToggle';
const { Option } = Select;

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const isDarkTheme = useSelector((state:RootState)=> state.colour.themeDark)
  const [collapsed, setCollapsed] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useSelector((state: RootState) => state.auth);
  const sessions = useSelector((state: RootState) => state.sessions);
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const onLearn=useSelector((state:RootState)=>state.string.onLearn)
  const userandSession=useSelector((state:RootState)=>state.string.learnSessionId)
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      if (user?.userId) {
        try {
          const userSessions = await getUserSessions(user.userId);
          dispatch(setSessions(userSessions));
        } catch (error) {
          console.error('Error fetching sessions:', error);
        }
      }
    };

    fetchSessions();
  }, [user, dispatch]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSessionClick = (sessionId: string,sessionType:string) => {
    router.push(`/${sessionType}?sessionId=${sessionId}`);
  };

 
  type MenuItem = Required<MenuProps>['items'][number];

  const item:MenuItem[]=[
    {
      key:"1",
      label:"Profile",
      icon:<ProfileOutlined></ProfileOutlined>,
      onClick:()=>message.success("Clicked Profile")
    },
    {
      key:"2",
      label:"Settings",
      icon:<SettingOutlined></SettingOutlined>,
      onClick:()=>message.success("Clicked Settings")

    },
    {
      key:"3",
      label:"Logout",
      icon:<LogoutOutlined></LogoutOutlined>,
      onClick:()=>{
        dispatch(clearUser())
        message.warning("Logged out!")
      }
    }
  ]
 
  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.sessionType === filter;
  });

  

  if (!mounted) {
    return null; // or a loading spinner
  }
  async function handleLearnClick(){

   const res= await getSession(userandSession.sessionId,userandSession.userId)
   try {
    const newsessionId = await createSession(
      {
        fileUrl: res.fileUrl,
        sessionType: "revise",
        contextType: res.contextType,
        context: res.context,
        sessionTitle: res.sessionTitle,
        messages: [],
      },
      userandSession.userId
    );
    console.log("sessionid ",newsessionId)

    const pathname = `/${"revise"}`;
    const query = { sessionId:newsessionId };
    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}?${queryString}`);
  } catch (error) {
    console.error("Failed to create session:", error);
    message.error("Failed to create session. Please try again.");
  }
  finally{
    dispatch(setOnLearn())
  }
  }

  return (

    <div className="flex h-screen">
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-0' : 'w-1/4'}`}>
        <div className="p-4">
          {!collapsed && (
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              onChange={(value)=>setFilter(value)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'learn', label: 'Learning' },
                { value: 'revise', label: 'Revising' }
              ]}
            />
          )}
        </div>
        <nav className="overflow-y-auto h-[calc(100vh-4rem)]">
          <ul>
            {filteredSessions.map((session) => (
              <li
                key={session.id}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer border border-gray-700 rounded-md m-2"
                onClick={() => handleSessionClick(session.sessionId,session.sessionType)}
              >
                 <span className=" text-sm">{session.title}</span>

                <br />
                <span className="text-xs text-gray-400">{session.sessionType}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex flex-col flex-grow">
        <header className="text-[#F5E8C7] shadow bg-black">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <Button
                type="text"
                icon={collapsed ?  <MenuUnfoldOutlined style={{ color: 'white',fontSize:'1.5rem' }} /> : 
                <MenuFoldOutlined style={{ color: 'white' }} />}
                onClick={toggleSidebar}
                className="text-lg w-10 h-10"
              />

              <Logo />
              <h1 className="text-2xl font-bold ml-0 text-custom-pink">.ai</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle></ThemeToggle>
            {(onLearn)&&<Button onClick={handleLearnClick}>Revise from this Chat</Button>}
              <Dropdown menu={{ items: item }} trigger={['click']}>
                <a className="flex items-center" onClick={e => {e.preventDefault()}}>
                  <Avatar icon={<UserOutlined />} className="mr-2" />
                  {mounted && user?.displayName && <span>{user.displayName}</span>}
                </a>
              </Dropdown>
            </div>
          </div>
        </header>
        <main className=' h-full'>
          
          {children}
          
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;