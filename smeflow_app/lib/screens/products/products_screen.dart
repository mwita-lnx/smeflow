import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../config/app_theme.dart';
import '../../providers/product_provider.dart';
import '../../providers/category_provider.dart';
import '../../models/product.dart';
import 'product_detail_screen.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadData();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadData() {
    final categoryProvider = context.read<CategoryProvider>();
    final productProvider = context.read<ProductProvider>();

    categoryProvider.loadCategories();
    productProvider.loadProducts();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      final productProvider = context.read<ProductProvider>();
      final pagination = productProvider.pagination;

      if (pagination != null &&
          pagination['page'] < pagination['totalPages'] &&
          !productProvider.isLoading) {
        productProvider.loadProducts(
          query: _searchController.text.isNotEmpty ? _searchController.text : null,
          category: _selectedCategory,
          page: pagination['page'] + 1,
          append: true,
        );
      }
    }
  }

  void _onSearch(String query) {
    final productProvider = context.read<ProductProvider>();
    productProvider.loadProducts(
      query: query.isNotEmpty ? query : null,
      category: _selectedCategory,
    );
  }

  void _onCategorySelected(String? category) {
    setState(() {
      _selectedCategory = _selectedCategory == category ? null : category;
    });

    final productProvider = context.read<ProductProvider>();
    productProvider.loadProducts(
      query: _searchController.text.isNotEmpty ? _searchController.text : null,
      category: _selectedCategory,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgBlue,
      appBar: AppBar(
        title: Text(
          'Products',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/home');
            },
            icon: const Icon(Icons.business),
            tooltip: 'Browse Businesses',
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filters
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                // Search bar
                TextField(
                  controller: _searchController,
                  onSubmitted: _onSearch,
                  decoration: InputDecoration(
                    hintText: 'Search products...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              _onSearch('');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: AppTheme.background,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Categories (optional filter)
          Consumer<CategoryProvider>(
            builder: (context, categoryProvider, child) {
              if (categoryProvider.categories.isEmpty) {
                return const SizedBox.shrink();
              }

              return Container(
                height: 60,
                color: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: categoryProvider.categories.length,
                  itemBuilder: (context, index) {
                    final category = categoryProvider.categories[index];
                    final isSelected = _selectedCategory == category.slug;

                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(category.name),
                        selected: isSelected,
                        onSelected: (_) => _onCategorySelected(category.slug),
                        backgroundColor: AppTheme.background,
                        selectedColor: AppTheme.accentOrange.withOpacity(0.2),
                        checkmarkColor: AppTheme.accentOrange,
                        labelStyle: TextStyle(
                          color: isSelected
                              ? AppTheme.accentOrange
                              : AppTheme.textSecondary,
                          fontWeight:
                              isSelected ? FontWeight.w600 : FontWeight.w400,
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          ),

          // Products Grid
          Expanded(
            child: Consumer<ProductProvider>(
              builder: (context, productProvider, child) {
                if (productProvider.isLoading && productProvider.products.isEmpty) {
                  return const Center(
                    child: CircularProgressIndicator(
                      color: AppTheme.accentOrange,
                    ),
                  );
                }

                if (productProvider.hasError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: AppTheme.textSecondary,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Error loading products',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          productProvider.error ?? 'Unknown error',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppTheme.textSecondary,
                              ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: _loadData,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Retry'),
                        ),
                      ],
                    ),
                  );
                }

                if (productProvider.products.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.shopping_bag_outlined,
                          size: 80,
                          color: AppTheme.textSecondary.withOpacity(0.5),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No products found',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Try adjusting your search or filters',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppTheme.textSecondary,
                              ),
                        ),
                      ],
                    ),
                  );
                }

                final pagination = productProvider.pagination;
                final currentPage = pagination?['page'] ?? 1;
                final totalPages = pagination?['totalPages'] ?? 1;

                return Column(
                  children: [
                    Expanded(
                      child: RefreshIndicator(
                        onRefresh: () async => _loadData(),
                        color: AppTheme.accentOrange,
                        child: GridView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.7,
                            crossAxisSpacing: 16,
                            mainAxisSpacing: 16,
                          ),
                          itemCount: productProvider.products.length +
                              (productProvider.isLoading ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == productProvider.products.length) {
                              return const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child: CircularProgressIndicator(
                                    color: AppTheme.accentOrange,
                                  ),
                                ),
                              );
                            }

                            final product = productProvider.products[index];
                            return _ProductCard(product: product);
                          },
                        ),
                      ),
                    ),

                    // Pagination Controls
                    if (totalPages > 1)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, -2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Previous Button
                            IconButton(
                              onPressed: currentPage > 1
                                  ? () {
                                      productProvider.loadProducts(
                                        query: _searchController.text.isNotEmpty
                                            ? _searchController.text
                                            : null,
                                        category: _selectedCategory,
                                        page: currentPage - 1,
                                      );
                                    }
                                  : null,
                              icon: const Icon(Icons.chevron_left),
                              style: IconButton.styleFrom(
                                backgroundColor: currentPage > 1
                                    ? AppTheme.accentOrange.withOpacity(0.1)
                                    : AppTheme.background,
                                foregroundColor: currentPage > 1
                                    ? AppTheme.accentOrange
                                    : AppTheme.textSecondary,
                              ),
                            ),

                            // Page Indicator
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'Page $currentPage of $totalPages',
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                ),
                                const SizedBox(width: 12),
                                // Quick page jump dropdown
                                if (totalPages > 3)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppTheme.background,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: DropdownButton<int>(
                                      value: currentPage,
                                      underline: const SizedBox(),
                                      icon: const Icon(Icons.arrow_drop_down, size: 20),
                                      onChanged: (page) {
                                        if (page != null) {
                                          productProvider.loadProducts(
                                            query: _searchController.text.isNotEmpty
                                                ? _searchController.text
                                                : null,
                                            category: _selectedCategory,
                                            page: page,
                                          );
                                        }
                                      },
                                      items: List.generate(
                                        totalPages,
                                        (index) => DropdownMenuItem(
                                          value: index + 1,
                                          child: Text('${index + 1}'),
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),

                            // Next Button
                            IconButton(
                              onPressed: currentPage < totalPages
                                  ? () {
                                      productProvider.loadProducts(
                                        query: _searchController.text.isNotEmpty
                                            ? _searchController.text
                                            : null,
                                        category: _selectedCategory,
                                        page: currentPage + 1,
                                      );
                                    }
                                  : null,
                              icon: const Icon(Icons.chevron_right),
                              style: IconButton.styleFrom(
                                backgroundColor: currentPage < totalPages
                                    ? AppTheme.accentOrange.withOpacity(0.1)
                                    : AppTheme.background,
                                foregroundColor: currentPage < totalPages
                                    ? AppTheme.accentOrange
                                    : AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Product product;

  const _ProductCard({required this.product});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ProductDetailScreen(product: product),
            ),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            Expanded(
              flex: 3,
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                child: product.mainImage.isNotEmpty
                    ? CachedNetworkImage(
                        imageUrl: product.mainImage,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          color: AppTheme.background,
                          child: const Center(
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: AppTheme.accentOrange,
                            ),
                          ),
                        ),
                        errorWidget: (context, url, error) => Container(
                          color: AppTheme.background,
                          child: Icon(
                            Icons.shopping_bag_outlined,
                            size: 48,
                            color: AppTheme.textSecondary.withOpacity(0.3),
                          ),
                        ),
                      )
                    : Container(
                        color: AppTheme.background,
                        child: Icon(
                          Icons.shopping_bag_outlined,
                          size: 48,
                          color: AppTheme.textSecondary.withOpacity(0.3),
                        ),
                      ),
              ),
            ),

            // Product Info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      product.name,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      product.displayPrice,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppTheme.accentOrange,
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    if (!product.isAvailable)
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.textSecondary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'Out of stock',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppTheme.textSecondary,
                                fontSize: 10,
                              ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
