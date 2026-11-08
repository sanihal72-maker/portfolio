"use client";

import * as React from "react";
import { Star, Quote, ExternalLink, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolio } from "./data-context";
import { Section, SectionHeading } from "./section";
import type { Project } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export function Testimonials() {
  const { testimonials, projects } = usePortfolio();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (testimonials.length === 0) return null;

  // Resolve a testimonial's projectRef to an actual Project title
  function resolveProject(ref: string | null): Project | undefined {
    if (!ref) return undefined;
    return (
      projects.find((p) => p.id === ref) ||
      projects.find((p) => p.title.toLowerCase() === ref.toLowerCase())
    );
  }

  return (
    <Section id="testimonials" className="pt-12 pb-8 lg:pt-16 lg:pb-10 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading index="08" title="Client Testimonials" />

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollPrev()}
            className="size-10 rounded-full border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollNext()}
            className="size-10 rounded-full border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Carousel Container — exactly 3 items on desktop */}
      <div className="mt-8 overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-6">
            {testimonials.map((t) => {
              const project = resolveProject(t.projectRef);
              const projectTitle = project ? project.title : t.projectRef;
              const proofLink = t.proofUrl || t.screenshotUrl;

              return (
                <CarouselItem
                  key={t.id}
                  className="pl-4 sm:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <figure className="flex h-full min-h-[300px] flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40">
                    <div>
                      <div className="flex items-center justify-between">
                        <Quote className="size-7 text-primary/40" />
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={
                                idx < t.rating
                                  ? "size-3.5 fill-primary text-primary"
                                  : "size-3.5 text-border"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <blockquote className="mt-4 text-pretty text-sm leading-relaxed text-foreground/90">
                        “{t.review}”
                      </blockquote>

                      {/* Proof Link */}
                      {proofLink && (
                        <div className="mt-4">
                          <a
                            href={proofLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/proof inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50"
                          >
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                            <span>Proof Link</span>
                            <ExternalLink className="size-3 transition-transform group-hover/proof:translate-x-0.5 group-hover/proof:-translate-y-0.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    <figcaption className="mt-6 border-t border-border pt-4">
                      <div className="flex items-center gap-3">
                        {t.photoUrl ? (
                          <img
                            src={t.photoUrl}
                            alt={t.clientName}
                            className="size-10 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-primary">
                            {t.clientName.charAt(0)}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-foreground">
                            {t.clientName}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {t.designation}
                            {t.business ? ` · ${t.business}` : ""}
                          </div>
                          {projectTitle && (
                            <div className="mt-1 truncate text-[11px] text-muted-foreground">
                              Project: <span className="font-medium text-foreground/80">{projectTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Carousel Pagination Dots */}
        {count > 1 && (
          <div className="mt-6 flex justify-center gap-1.5">
            {Array.from({ length: count }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => api?.scrollTo(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  current === idx ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Testimonials reflect genuine client feedback. No fabricated reviews are published.
      </p>
    </Section>
  );
}
