
import { useProjectStore } from '@/stores/project';
import { ProjectTemplate } from '@/types';

export const TemplateCard = ({ template }: { template: ProjectTemplate }) => {
  const { openProject } = useProjectStore();

  return (
    <button
      onClick={() => openProject(template.slug)}
      className="w-full max-w-[340px] rounded-xl border border-blossom-soft
                 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
    >
      <img src={template.thumbnail} className="mb-4 h-40 w-full rounded" />
      <h3 className="mb-1 font-semibold text-lg text-blossom-dark">
        {template.name}
      </h3>
      <p className="text-sm text-gray-600">{template.description}</p>
    </button>
  );
};

export const Templates = ({ templates }: { templates: ProjectTemplate[] }) => {
  return (
    <div className="grid gap-8 px-8 auto-rows-max sm:grid-cols-2 xl:grid-cols-3">
      {templates.map(t => (
        <TemplateCard key={t.slug} template={t} />
      ))}
    </div>
  );
};
