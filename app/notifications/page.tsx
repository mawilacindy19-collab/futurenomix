import { Bell, Heart, MessageSquare, UserPlus, Briefcase, Star } from 'lucide-react';
import Image from 'next/image';

export default function NotificationsPage() {
  return (
    <div className="p-4 lg:p-8 w-full max-w-2xl mx-auto min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Notifications</h1>
        <button className="text-sm text-primary font-medium hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-1">
          <NotificationItem 
            icon={Briefcase} 
            color="text-purple-500 bg-purple-500/10" 
            text="Green Funds Ventures just viewed the pitch deck attached to your post." 
            time="10m ago"
            unread
            avatarUrl="https://dummyimage.com/100x100/1e293b/ffffff?text=green"
          />
          <NotificationItem 
            icon={MessageSquare} 
            color="text-blue-500 bg-blue-500/10" 
            text="David Chen commented on your Idea: 'I've built something similar using Go. Happy to chat.'" 
            time="2h ago"
            unread
            avatarUrl="https://dummyimage.com/100x100/1e293b/ffffff?text=david"
          />
          <NotificationItem 
            icon={UserPlus} 
            color="text-emerald-500 bg-emerald-500/10" 
            text="Sarah Jenkins followed your profile. You currently have 94% matching skills for her project." 
            time="5h ago"
            avatarUrl="https://dummyimage.com/100x100/1e293b/ffffff?text=sarah"
          />
          <NotificationItem 
            icon={Star} 
            color="text-yellow-500 bg-yellow-500/10" 
            text="orbit AI found 3 new jobs matching your 'Full Stack Developer' criteria in San Francisco." 
            time="1d ago"
            avatarUrl="https://dummyimage.com/100x100/1e293b/ffffff?text=orbit"
          />
          <NotificationItem 
            icon={Heart} 
            color="text-red-500 bg-red-500/10" 
            text="14 people liked your post about 'The Future of AI Logistics'." 
            time="2d ago"
            avatarUrl="https://dummyimage.com/100x100/1e293b/ffffff?text=users"
          />
      </div>
    </div>
  );
}

function NotificationItem({ icon: Icon, color, text, time, unread, avatarUrl }: any) {
    return (
        <div className={`p-4 rounded-xl flex gap-4 hover:bg-muted/50 transition-colors cursor-pointer ${unread ? 'bg-primary/5 border border-primary/20' : 'border border-transparent'}`}>
            <div className="relative flex-shrink-0 mt-1">
               <Image src={avatarUrl} alt="Notification" width={40} height={40} unoptimized className="w-10 h-10 rounded-full object-cover border border-border" referrerPolicy="no-referrer" />
               <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${color} border-2 border-card`}>
                   <Icon className="w-3 h-3" />
               </div>
            </div>
            <div className="flex-1">
                <p className={`text-sm leading-snug ${unread ? 'font-bold text-foreground' : 'text-foreground/80 font-medium'}`}>{text}</p>
                <p className={`text-xs mt-1 ${unread ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{time}</p>
            </div>
            {unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
            )}
        </div>
    )
}
