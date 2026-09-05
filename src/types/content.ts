import type { PortableTextBlock, ContentBylineCredit, TaxonomyTerm } from "emdash";

export interface RetreatData {
	id: string;
	slug: string | null;
	status: string;
	title: string;
	subtitle?: string;
	start_date: string;
	end_date: string;
	registration_deadline?: string;
	status_override?: string;
	location: string;
	price?: string;
	easy_tithe_form_id?: string;
	featured_image?: {
		id: string;
		src?: string;
		alt?: string;
	};
	excerpt?: string;
	content?: PortableTextBlock[];
	schedule?: string;
	lodging_info?: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date | null;
	bylines?: ContentBylineCredit[];
	terms?: Record<string, TaxonomyTerm[]>;
}

export interface ArticleData {
	id: string;
	slug: string | null;
	status: string;
	title: string;
	author: string;
	published_at: string;
	excerpt?: string;
	featured_image?: {
		id: string;
		src?: string;
		alt?: string;
	};
	content?: PortableTextBlock[];
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date | null;
	bylines?: ContentBylineCredit[];
	terms?: Record<string, TaxonomyTerm[]>;
}

export interface MediaData {
	id: string;
	slug: string | null;
	status: string;
	title: string;
	media_type: string;
	speaker?: string;
	date?: string;
	media_url?: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date | null;
	bylines?: ContentBylineCredit[];
	terms?: Record<string, TaxonomyTerm[]>;
}

declare module "emdash" {
	interface EmDashCollections {
		retreats: RetreatData;
		articles: ArticleData;
		media: MediaData;
	}
}
