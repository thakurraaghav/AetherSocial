import { useState, useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../lib/axios';
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { Loader2, Trash2, Sparkles } from 'lucide-react';
import PostPreviewModal from './PostPreviewModal';

export interface Post {
  id: string;
  targetPlatform: string;
  textContent: string;
  imageUrl: string;
  status: string;
  scheduledAt: string | null;
}

const platformIcons: Record<string, string> = {
  LINKEDIN: 'work',
  INSTAGRAM: 'photo_camera',
  X: 'flutter_dash'
};

import type { Modifier } from '@dnd-kit/core';

const snapCenterToCursor: Modifier = ({
  transform,
  activatorEvent,
  activeNodeRect,
}) => {
  if (activatorEvent && activeNodeRect) {
    const mouseEvent = activatorEvent as MouseEvent;
    const touchEvent = activatorEvent as TouchEvent;

    const isMouseEvent = 'clientX' in activatorEvent;
    const clientX = isMouseEvent ? mouseEvent.clientX : touchEvent.touches[0].clientX;
    const clientY = isMouseEvent ? mouseEvent.clientY : touchEvent.touches[0].clientY;

    const offsetX = clientX - activeNodeRect.left - activeNodeRect.width / 2;
    const offsetY = clientY - activeNodeRect.top - activeNodeRect.height / 2;

    return {
      ...transform,
      x: transform.x + offsetX,
      y: transform.y + offsetY,
    };
  }
  return transform;
};

const platformColors: Record<string, string> = {
  LINKEDIN: 'text-[#0077b5]',
  INSTAGRAM: 'text-[#E1306C]',
  X: 'text-[#dce1fb]'
};

// PRESENTATIONAL POST CARD
const PostCard = forwardRef<HTMLDivElement, { post: Post, onSelect?: (p: Post) => void, onDelete?: (id: string) => void, isOverlay?: boolean, style?: React.CSSProperties, className?: string }>(
  ({ post, onSelect, onDelete, isOverlay = false, style, className = '', ...props }, ref) => {
    const timeStr = post.scheduledAt 
      ? new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'DRAFT';

    return (
      <div
        ref={ref}
        style={style}
        {...props}
        onClick={onSelect ? () => onSelect(post) : undefined}
        className={`bg-[#0c1324] border rounded p-2 cursor-grab active:cursor-grabbing hover:border-[#c3c0ff]/50 transition-colors group relative w-full min-w-[150px] ${
          isOverlay ? 'border-[#c3c0ff] shadow-[0_0_30px_rgba(195,192,255,0.2)] opacity-100 z-[100]' : 'border-[#464555]/30'
        } ${className}`}
      >
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id);
            }}
            className="absolute -top-2 -right-2 bg-[#ffb4ab] text-[#690005] p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 shadow-lg"
            title="Delete Draft"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
        <div className="flex justify-between items-center mb-1">
          <span className={`material-symbols-outlined text-[14px] ${platformColors[post.targetPlatform] || 'text-[#c7c4d8]'}`}>
            {platformIcons[post.targetPlatform] || 'article'}
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d8] uppercase tracking-wider">{timeStr}</span>
        </div>
        <p className="font-['Inter'] text-[11px] text-[#dce1fb] line-clamp-2 group-hover:text-[#c3c0ff] transition-colors">{post.textContent}</p>
      </div>
    );
  }
);

// DRAGGABLE WRAPPER
function DraggablePost({ post, onSelect, onDelete }: { post: Post, onSelect: (p: Post) => void, onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: post.id,
    data: { post }
  });

  return (
    <PostCard 
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      post={post} 
      onSelect={onSelect} 
      onDelete={onDelete} 
      className={`${isDragging ? 'opacity-30' : ''} shrink-0 w-full`}
    />
  );
}

// DROPPABLE AREA (The Calendar Day)
function DroppableDay({ date, posts, onSelect, onDelete }: { date: Date, posts: Post[], onSelect: (p: Post) => void, onDelete: (id: string) => void }) {
  const dateString = date.toISOString().split('T')[0];
  const { isOver, setNodeRef } = useDroppable({
    id: dateString,
  });

  const isToday = new Date().toISOString().split('T')[0] === dateString;

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-[150px] rounded-lg transition-all duration-300 ${isOver ? 'bg-[#4f46e5]/10 shadow-[inset_0_0_20px_rgba(79,70,229,0.2)]' : ''}`}
    >
      {/* Header */}
      <div className={`font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider uppercase text-center pb-[8px] border-b relative ${isToday ? 'text-[#c3c0ff] border-[#c3c0ff]/50' : 'text-[#c7c4d8] border-[#464555]/20'}`}>
        {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
        {isToday && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#c3c0ff] rounded-t"></div>}
      </div>
      {/* Grid Cell (Droppable) */}
      <div className="min-h-[150px] p-1 mt-[8px] flex flex-col gap-1 flex-1">
        {posts.map(post => (
          <DraggablePost key={post.id} post={post} onSelect={onSelect} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

// DROPPABLE DRAFTS SIDEBAR
function DroppableDrafts({ drafts, onSelect, onDelete }: { drafts: Post[], onSelect: (p: Post) => void, onDelete: (id: string) => void }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'DRAFTS',
  });

  return (
    <div className="mt-[24px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <span className="material-symbols-outlined text-[#c7c4d8]">inbox</span>
        <h3 className="font-['Inter'] text-[18px] font-medium text-[#dce1fb]">AI Drafts</h3>
        <span className="bg-[#464555]/30 text-[#c7c4d8] text-[10px] px-2 py-0.5 rounded-full font-['JetBrains_Mono']">{drafts.length}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex gap-[16px] overflow-x-auto pb-4 min-h-[150px] p-[16px] rounded-lg border transition-colors ${
          isOver ? 'bg-[#c3c0ff]/10 border-[#c3c0ff] border-dashed shadow-[0_0_30px_-5px_rgba(195,192,255,0.2)]' : 'bg-[#0c1324]/50 border-white/5'
        }`}
      >
        {drafts.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-center p-8 bg-[#0c1324] border border-white/5 rounded-xl border-dashed">
            <div className="w-16 h-16 rounded-full bg-[#4f46e5]/10 border border-[#4f46e5]/20 flex items-center justify-center mb-4 relative animate-pulse">
              <div className="absolute inset-0 bg-[#4f46e5] rounded-full blur-[20px] opacity-20"></div>
              <Sparkles className="w-8 h-8 text-[#c3c0ff]" />
            </div>
            <h3 className="font-['Inter'] text-[16px] font-semibold text-[#dce1fb] mb-2">No Drafts Available</h3>
            <p className="font-['Inter'] text-[13px] text-[#c7c4d8] max-w-[250px]">
              Use the Content Studio to generate AI posts, or create one manually.
            </p>
          </div>
        ) : (
          drafts.map(post => (
            <div key={post.id} className="w-[200px] shrink-0">
              <DraggablePost post={post} onSelect={onSelect} onDelete={onDelete} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CalendarGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeWidth, setActiveWidth] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const fetchPosts = async () => {
    try {
      const response = await api.get('/calendar/posts');
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    // Optimistic UI update
    setPosts(current => current.filter(post => post.id !== id));
    
    try {
      await api.delete(`/calendar/posts/${id}`);
      toast.success('Draft deleted');
    } catch (error) {
      toast.error('Failed to delete draft');
      fetchPosts(); // Revert on failure
    }
  };

  const handleUpdatePost = async (id: string, textContent: string) => {
    try {
      await api.put(`/calendar/posts/${id}`, { textContent });
      
      // Update local state and the selected post if open
      setPosts(current => current.map(post => 
        post.id === id ? { ...post, textContent } : post
      ));
      
      if (selectedPost?.id === id) {
        setSelectedPost(prev => prev ? { ...prev, textContent } : null);
      }
      
      toast.success('Post updated!');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Capture the exact width of the original element being dragged
    const initialRect = event.active.rect.current.initial;
    if (initialRect) {
      setActiveWidth(initialRect.width);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const postId = active.id as string;
    const targetId = over.id as string; 

    // Handle dropping back to DRAFTS
    if (targetId === 'DRAFTS') {
      setPosts(current => current.map(post => 
        post.id === postId ? { ...post, scheduledAt: null, status: 'DRAFT' } : post
      ));

      try {
        await api.patch('/calendar/schedule', { postId, scheduledAt: null });
        toast.success('Post unscheduled');
      } catch (error) {
        toast.error('Failed to unschedule post');
        fetchPosts();
      }
      return;
    }

    // Handle dropping to a specific Date
    setPosts(current => current.map(post => {
      if (post.id === postId) {
        return { ...post, scheduledAt: new Date(targetId).toISOString(), status: 'SCHEDULED' };
      }
      return post;
    }));

    try {
      await api.patch('/calendar/schedule', {
        postId,
        scheduledAt: new Date(targetId).toISOString()
      });
      toast.success('Post scheduled!');
    } catch (error) {
      toast.error('Failed to schedule post');
      fetchPosts();
    }
  };

  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const drafts = posts.filter(p => !p.scheduledAt || p.status === 'DRAFT');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#c3c0ff]" />
      </div>
    );
  }

  const activePost = activeId ? posts.find(p => p.id === activeId) : null;

  return (
    <>
      <PostPreviewModal 
        isOpen={!!selectedPost}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onSave={(updated) => handleUpdatePost(updated.id, updated.textContent)}
      />

      <section className="bg-[#191f31]/90 backdrop-blur-md rounded-xl border border-white/10 p-[24px] shadow-lg">
        <header className="flex justify-between items-center mb-[24px]">
          <h2 className="font-['Inter'] text-[18px] font-medium text-[#dce1fb] flex items-center gap-[8px]">
            <span className="material-symbols-outlined text-[#918fa1]">calendar_view_week</span>
            Upcoming Pipeline
          </h2>
          <div className="flex gap-[8px]">
            <button className="px-3 py-1 bg-[#0c1324] border border-[#464555]/30 rounded text-[#c7c4d8] font-['Inter'] text-[14px] hover:text-[#dce1fb] transition-colors">Week</button>
            <button className="px-3 py-1 bg-[#33394c] border border-[#464555]/50 rounded text-[#dce1fb] font-['Inter'] text-[14px]">Month</button>
          </div>
        </header>

        <DndContext 
          sensors={sensors} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          {/* Horizontal Scroll Grid Container */}
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[1000px] grid grid-cols-7 gap-[8px]">
              {next7Days.map(date => {
                const dateString = date.toISOString().split('T')[0];
                const dayPosts = posts.filter(p => p.scheduledAt && p.scheduledAt.startsWith(dateString));
                return <DroppableDay key={dateString} date={date} posts={dayPosts} onSelect={setSelectedPost} onDelete={handleDeletePost} />;
              })}
            </div>
          </div>

          <DroppableDrafts drafts={drafts} onSelect={setSelectedPost} onDelete={handleDeletePost} />

          {createPortal(
            <DragOverlay 
              modifiers={[snapCenterToCursor]}
              dropAnimation={{
                duration: 250,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
              }}
            >
              {activePost ? (
                <PostCard 
                  post={activePost} 
                  isOverlay 
                  style={{ width: activeWidth ? `${activeWidth}px` : '200px', margin: 0 }} 
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </section>
    </>
  );
}
