import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  theme: string;
  image: string;
  photographer: string;
  photoLink: string;
  charCount: number;
  contentHtml?: string;
  excerpt?: string;
}

export function getSortedPostsData(): PostData[] {
  // content/postsディレクトリが存在しない場合
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // 抜粋を生成（最初の200文字）
      const content = matterResult.content;
      const excerpt = content
        .replace(/^#+\s+.+$/gm, '') // 見出しを除去
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 200) + '...';

      return {
        slug,
        title: matterResult.data.title || '',
        date: matterResult.data.date || '',
        theme: matterResult.data.theme || '',
        image: matterResult.data.image || '',
        photographer: matterResult.data.photographer || '',
        photoLink: matterResult.data.photoLink || '',
        charCount: matterResult.data.charCount || 0,
        excerpt,
      };
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // MarkdownをHTMLに変換
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: matterResult.data.title || '',
    date: matterResult.data.date || '',
    theme: matterResult.data.theme || '',
    image: matterResult.data.image || '',
    photographer: matterResult.data.photographer || '',
    photoLink: matterResult.data.photoLink || '',
    charCount: matterResult.data.charCount || 0,
  };
}

