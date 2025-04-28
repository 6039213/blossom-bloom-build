
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Globe,
  Code
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  lastEdited?: string;
  status?: 'published' | 'draft' | 'archived';
  onDelete?: (id: string) => void;
}

export default function ProjectCard({
  id,
  title,
  description = "No description",
  thumbnail = "/placeholder.svg",
  lastEdited = "Never edited",
  status = "draft",
  onDelete
}: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteClick = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(id);
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleCopyClick = () => {
    toast.success("Project duplicated");
  };
  
  const statusColors = {
    published: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    draft: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
    archived: "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400"
  };
  
  const statusLabels = {
    published: "Published",
    draft: "Draft",
    archived: "Archived"
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 dark:bg-gray-900/90">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleCopyClick}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">Last edited: {lastEdited}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="default"
          className="flex-1 h-9 bg-blossom-500 hover:bg-blossom-600 text-white" 
          asChild
        >
          <Link to={`/dashboard/editor/${id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        
        {status === 'published' && (
          <Button variant="outline" className="h-9" asChild>
            <a href={`/preview/${id}`} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" />
              <span className="sr-only">View live site</span>
            </a>
          </Button>
        )}
        
        <Button variant="outline" className="h-9" asChild>
          <Link to={`/dashboard/code/${id}`}>
            <Code className="h-4 w-4" />
            <span className="sr-only">View code</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
