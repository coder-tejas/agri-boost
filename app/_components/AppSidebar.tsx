import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BotMessageSquare,  Settings, Sprout, Users, User2  } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const items = [
    {
        title: "Crop Analysis",
        url: "/crop-analysis",
        icon: Sprout,
    },
    {
        title: "ChatBot Assistant",
        url: "/chatbot",
        icon: BotMessageSquare ,
    },
    {
        title: "Community",
        url: "/community",
        icon: Users ,
    },
    {
        title: "Expert",
        url: "/contact-to-expert",
        icon: User2 ,
    },
    {
        title: "Setting",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4'>
                    <Image src={'/logo.png'} alt='logo' width={100} height={100}
                        className='w-full h-full' />
                    {/* <h2 className='text-sm text-gray-400 text-center'>Build Awesome</h2> */}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-5'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 rounded-lg ${path.includes(item.url) && 'bg-gray-200ß'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
        </Sidebar>
    )
}