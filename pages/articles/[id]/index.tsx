import {GetStaticPaths, GetStaticProps} from 'next';
import client from "../../../contentful";
import {IArticle, IArticleFields} from "../../../contentful-types";
import {documentToReactComponents} from '@contentful/rich-text-react-renderer';
import Head from "next/head";
import {Container} from "reactstrap";


export default function Article({page}: { page: IArticle }) {
    return (
        <main>
            <Head>
                <title>{page.fields.title}</title>
            </Head>
            <Container>
                <h1 className='py-3'>
                    {page.fields.title}
                </h1>
                <div className='mt-3'>
                    {documentToReactComponents(page.fields.content!)}
                </div>
            </Container>
        </main>
    )
}

export const getStaticPaths: GetStaticPaths = async (args) => {
    const articles = await client.getEntries<IArticleFields>({
        content_type: 'article'
    })

    return {
        paths: articles.items.map(article => {
            return {
                params: {
                    id: article.fields.slug
                }
            }
        }),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async (args) => {
    const article = await client.getEntries<IArticleFields>({
        content_type: 'article',
        'fields.slug': args.params!.id!,
        limit: 1
    });

    const [page] = article.items;

    return {
        props: {
            page
        }
    }
}