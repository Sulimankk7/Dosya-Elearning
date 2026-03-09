import { DosyaCard } from "./DosyaCard";
import { DosyaButton } from "./DosyaButton";
import { BookOpen, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  instructor?: string;
  duration?: string;
  students?: number;
  enrolled?: boolean;
  progress?: number;
}

export function CourseCard({
  id,
  title,
  description,
  price,
  image,
  instructor,
  duration,
  students,
  enrolled = false,
  progress,
}: CourseCardProps) {
  return (
    <DosyaCard className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden p-0">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {enrolled && progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white">التقدم</span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl mb-2 text-foreground line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        {instructor && (
          <p className="text-sm text-muted-foreground mb-3">
            المدرب: <span className="text-foreground">{instructor}</span>
          </p>
        )}
        
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          )}
          {students && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{students} طالب</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>12 درس</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-2xl text-primary">{price}</span>
          {enrolled ? (
            <Link to={`/learn/${id}`}>
              <DosyaButton size="sm">
                {progress === 100 ? "مراجعة" : "متابعة التعلم"}
              </DosyaButton>
            </Link>
          ) : (
            <Link to={`/courses/${id}`}>
              <DosyaButton size="sm">سجل الآن</DosyaButton>
            </Link>
          )}
        </div>
      </div>
    </DosyaCard>
  );
}
