import { Badge } from "@/components/ui/badge";

export type ChangelogEntry = {
  createdAt: string;
  status: string;
  description: string;
  location: string;
  participantId:string;
  
};

export interface Changelog1Props {
  title?: string;
  description?: string;
  entries?: ChangelogEntry[];
  className?: string;
}


const ChangelogProduct = ({
  title = "Product Changelog",
  description = "Get the latest updates to your Product.",
  entries=[]
  
}: Changelog1Props) => {
  return  (
    <section className="mx-auto py-32">
      <div >
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="text-muted-foreground mb-6 text-base md:text-lg">
            {description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-4 md:flex-row md:gap-16"
            >
              <div className="top-8 flex h-min w-64 shrink-0 items-center gap-4 md:sticky">
                <Badge variant="secondary" className="text-xs">
                  transaction {index+1}
                </Badge>
                <span className="text-muted-foreground text-xs font-medium">
                  {new Date(entry.createdAt+"z").toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-foreground/90 mb-3 text-lg font-bold leading-tight md:text-2xl">
                  {entry.status}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  {entry.description}
                </p>
                  <ul className="text-muted-foreground ml-4 mt-4 space-y-1.5 text-sm md:text-base">
                      <li className="list-disc">
                       location: {entry.location}
                      </li>
                      <li className="list-disc">
                       participantId:{entry.participantId}
                      </li>
                  </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChangelogProduct ;
