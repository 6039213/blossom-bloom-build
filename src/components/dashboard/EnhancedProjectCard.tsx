
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EnhancedProjectCardProps {
  id: string;
  title: string;
  description: string;
  lastEdited: string;
  status: 'draft' | 'published' | 'archived';
  previewImage?: string;
  chatId?: string;
  onDelete: (id: string) => void;
}

export default function EnhancedProjectCard({
  id,
  title,
  description,
  lastEdited,
  status,
  previewImage,
  chatId,
  onDelete,
}: EnhancedProjectCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Generate a preview URL from the project data if none is provided
  useEffect(() => {
    if (!previewImage) {
      // In real app, this might fetch from an API or generate a thumbnail
      // For now, use a placeholder with a color derived from project ID
      const hue = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
      setGeneratedPreviewUrl(`https://placehold.co/600x400/hsl(${hue},70%,80%)/white?text=${encodeURIComponent(title)}`);
    }
  }, [id, title, previewImage]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const handleDelete = () => {
    onDelete(id);
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    navigate(`/dashboard/ai-builder?project=${id}&chat=${chatId || ''}`);
  };

  const handleView = () => {
    navigate(`/dashboard/projects/${id}`);
  };

  return (
    <>
      <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative w-full h-36 overflow-hidden bg-muted" onClick={handleView}>
          <img
            src={previewImage || generatedPreviewUrl || "/placeholder.svg"}
            alt={`${title} preview`}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="flex-grow flex flex-col p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary" onClick={handleView}>
              {title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2 flex-shrink-0">
                  <span className="sr-only">Opties</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor"/>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="h-4 w-4 mr-2" />
                  Bekijken
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Bewerken
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Verwijderen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {description || "Geen beschrijving"}
          </p>
          
          <div className="mt-auto text-xs text-muted-foreground">
            Laatst bewerkt: {lastEdited}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleView}
          >
            <Eye className="h-4 w-4 mr-2" />
            Bekijken
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Bewerken
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je zeker dat je dit project wilt verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Het project en alle bijbehorende gegevens worden permanent verwijderd.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
