import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../models/product.dart';
import '../../services/mpesa_service.dart';
import '../../services/verification_service.dart';
import '../../providers/auth_provider.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _currentImageIndex = 0;
  bool _isProcessingPayment = false;
  bool _isVerifying = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          // App Bar with Image Gallery
          SliverAppBar(
            expandedHeight: 400,
            pinned: true,
            backgroundColor: AppTheme.accentOrange,
            flexibleSpace: FlexibleSpaceBar(
              background: _buildImageGallery(),
            ),
          ),

          // Product Details
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Price and Availability Badge
                _buildPriceSection(),

                const SizedBox(height: 16),

                // Product Name and Description
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.product.name,
                        style: GoogleFonts.outfit(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        widget.product.description,
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                          color: AppTheme.textSecondary,
                          height: 1.6,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Product Info Cards
                _buildInfoSection(),

                const SizedBox(height: 24),

                // Action Buttons
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: _buildActionButtons(),
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImageGallery() {
    final images = widget.product.images.isNotEmpty
        ? widget.product.images
        : [''];

    return Stack(
      children: [
        // Image PageView
        PageView.builder(
          itemCount: images.length,
          onPageChanged: (index) {
            setState(() {
              _currentImageIndex = index;
            });
          },
          itemBuilder: (context, index) {
            final imageUrl = images[index];
            return imageUrl.isNotEmpty
                ? CachedNetworkImage(
                    imageUrl: imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: AppTheme.background,
                      child: const Center(
                        child: CircularProgressIndicator(
                          color: AppTheme.accentOrange,
                        ),
                      ),
                    ),
                    errorWidget: (context, url, error) => _buildPlaceholder(),
                  )
                : _buildPlaceholder();
          },
        ),

        // Gradient Overlay
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            height: 100,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Colors.black.withOpacity(0.7),
                ],
              ),
            ),
          ),
        ),

        // Page Indicator
        if (images.length > 1)
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                images.length,
                (index) => Container(
                  width: 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _currentImageIndex == index
                        ? Colors.white
                        : Colors.white.withOpacity(0.4),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppTheme.accentOrange.withOpacity(0.1),
      child: Center(
        child: Icon(
          Icons.shopping_bag_outlined,
          size: 120,
          color: AppTheme.accentOrange.withOpacity(0.3),
        ),
      ),
    );
  }

  Widget _buildPriceSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.accentOrange.withOpacity(0.1),
            Colors.white,
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Price',
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.product.displayPrice,
                  style: GoogleFonts.outfit(
                    fontSize: 36,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.accentOrange,
                    letterSpacing: -1,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: widget.product.isAvailable
                  ? AppTheme.primaryGreen.withOpacity(0.1)
                  : AppTheme.textSecondary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(
                color: widget.product.isAvailable
                    ? AppTheme.primaryGreen
                    : AppTheme.textSecondary,
                width: 2,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  widget.product.isAvailable
                      ? Icons.check_circle
                      : Icons.cancel,
                  size: 18,
                  color: widget.product.isAvailable
                      ? AppTheme.primaryGreen
                      : AppTheme.textSecondary,
                ),
                const SizedBox(width: 6),
                Text(
                  widget.product.isAvailable ? 'In Stock' : 'Out of Stock',
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: widget.product.isAvailable
                        ? AppTheme.primaryGreen
                        : AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          _buildInfoCard(
            icon: Icons.category_outlined,
            title: 'Category',
            value: widget.product.category?.replaceAll('-', ' ').toUpperCase() ?? 'General',
            color: AppTheme.primaryGreen,
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            icon: Icons.calendar_today,
            title: 'Listed',
            value: _formatDate(widget.product.createdAt),
            color: AppTheme.accentOrange,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    final authProvider = context.watch<AuthProvider>();
    final isLoggedIn = authProvider.isAuthenticated;

    return Column(
      children: [
        // Pay with M-Pesa Button
        if (widget.product.isAvailable && isLoggedIn)
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: _isProcessingPayment ? null : () => _showMpesaDialog(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryGreen,
                foregroundColor: Colors.white,
                disabledBackgroundColor: AppTheme.textSecondary.withOpacity(0.3),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: _isProcessingPayment
                  ? const SizedBox(
                      height: 24,
                      width: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.payment, size: 22),
                        const SizedBox(width: 12),
                        Text(
                          'Pay with M-Pesa',
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        if (widget.product.isAvailable && isLoggedIn) const SizedBox(height: 12),

        // Verify Product Button (QR Code)
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: _isVerifying ? null : () => _showQRScanner(),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.accentOrange,
              foregroundColor: Colors.white,
              disabledBackgroundColor: AppTheme.textSecondary.withOpacity(0.3),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: _isVerifying
                ? const SizedBox(
                    height: 24,
                    width: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.qr_code_scanner, size: 22),
                      const SizedBox(width: 12),
                      Text(
                        'Verify Product (QR)',
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
          ),
        ),
        const SizedBox(height: 12),

        // View Business Button
        SizedBox(
          width: double.infinity,
          height: 56,
          child: OutlinedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Viewing business details...'),
                ),
              );
            },
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.primaryGreen,
              side: const BorderSide(color: AppTheme.primaryGreen, width: 2),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.business, size: 22),
                const SizedBox(width: 12),
                Text(
                  'View Business',
                  style: GoogleFonts.outfit(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // Show M-Pesa payment dialog
  void _showMpesaDialog() {
    final phoneController = TextEditingController();
    final authProvider = context.read<AuthProvider>();
    final userPhone = authProvider.user?.phone ?? '';

    // Pre-fill with user's phone
    if (userPhone.isNotEmpty) {
      phoneController.text = userPhone;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Pay with M-Pesa',
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Amount: ${widget.product.displayPrice}',
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.accentOrange,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                labelText: 'M-Pesa Phone Number',
                hintText: '+254712345678',
                prefixIcon: const Icon(Icons.phone),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'You will receive an STK push on your phone. Enter your M-Pesa PIN to complete payment.',
              style: GoogleFonts.outfit(
                fontSize: 12,
                color: AppTheme.textSecondary,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _processPayment(phoneController.text);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryGreen,
              foregroundColor: Colors.white,
            ),
            child: const Text('Pay Now'),
          ),
        ],
      ),
    );
  }

  // Process M-Pesa payment
  Future<void> _processPayment(String phoneNumber) async {
    if (phoneNumber.isEmpty) {
      _showSnackbar('Please enter phone number', isError: true);
      return;
    }

    if (!MpesaService.isValidKenyanPhone(phoneNumber)) {
      _showSnackbar('Please enter a valid Kenyan phone number', isError: true);
      return;
    }

    setState(() => _isProcessingPayment = true);

    try {
      final formattedPhone = MpesaService.formatPhoneNumber(phoneNumber);
      final result = await MpesaService.initiatePayment(
        phoneNumber: formattedPhone,
        amount: widget.product.price,
        accountReference: 'PROD-${widget.product.id}',
        transactionDesc: 'Payment for ${widget.product.name}',
      );

      final checkoutRequestID = result['checkoutRequestID'];

      _showSnackbar('Payment initiated! Check your phone for STK push.');

      // Poll for payment status
      await _pollPaymentStatus(checkoutRequestID);
    } catch (e) {
      _showSnackbar('Payment failed: ${e.toString()}', isError: true);
    } finally {
      setState(() => _isProcessingPayment = false);
    }
  }

  // Poll payment status
  Future<void> _pollPaymentStatus(String checkoutRequestID) async {
    // Wait 6 seconds for simulation to complete
    await Future.delayed(const Duration(seconds: 6));

    try {
      final status = await MpesaService.queryTransactionStatus(checkoutRequestID);

      if (status['status'] == 'SUCCESS') {
        _showSuccessDialog(
          'Payment Successful!',
          'Receipt: ${status['mpesaReceiptNumber']}\nAmount: KES ${status['amount']}',
        );
      } else if (status['status'] == 'FAILED') {
        _showSnackbar('Payment failed: ${status['resultDesc']}', isError: true);
      } else {
        _showSnackbar('Payment is pending...', isError: false);
      }
    } catch (e) {
      _showSnackbar('Failed to check payment status', isError: true);
    }
  }

  // Show QR code scanner
  void _showQRScanner() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.5,
        minChildSize: 0.3,
        maxChildSize: 0.9,
        builder: (context, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              Container(
                margin: const EdgeInsets.symmetric(vertical: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.textSecondary.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text(
                      'Verify Product',
                      style: GoogleFonts.outfit(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Enter the QR code from the product packaging',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    // Manual QR code entry
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Enter QR code',
                        hintText: 'SF-xxxxx-xxxxx',
                        prefixIcon: const Icon(Icons.qr_code),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onSubmitted: (qrCode) {
                        Navigator.pop(context);
                        _verifyProduct(qrCode);
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'QR code format: SF-xxxxx-xxxxx',
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Verify product by QR code
  Future<void> _verifyProduct(String qrCode) async {
    if (qrCode.isEmpty) {
      _showSnackbar('Please enter QR code', isError: true);
      return;
    }

    if (!VerificationService.isValidQRCode(qrCode)) {
      _showSnackbar('Invalid QR code format', isError: true);
      return;
    }

    setState(() => _isVerifying = true);

    try {
      final result = await VerificationService.verifyProductByQR(
        qrCode: qrCode,
        deviceInfo: 'Flutter App',
      );

      if (result['isAuthentic'] == true) {
        _showSuccessDialog(
          'Authentic Product! ✓',
          'Serial: ${result['serialNumber']}\n'
          'Product: ${result['product']['name']}\n'
          'Business: ${result['business']['businessName']}\n'
          'Scans: ${result['totalScans']}',
        );
      } else {
        _showSnackbar('⚠️ Product verification failed - may be counterfeit!', isError: true);
      }
    } catch (e) {
      _showSnackbar('Verification failed: ${e.toString()}', isError: true);
    } finally {
      setState(() => _isVerifying = false);
    }
  }

  // Helper methods
  void _showSnackbar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppTheme.primaryRed : AppTheme.primaryGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showSuccessDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.check_circle, color: AppTheme.primaryGreen, size: 32),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
        content: Text(
          message,
          style: GoogleFonts.outfit(),
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryGreen,
              foregroundColor: Colors.white,
            ),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else if (difference.inDays < 30) {
      return '${(difference.inDays / 7).floor()} weeks ago';
    } else if (difference.inDays < 365) {
      return '${(difference.inDays / 30).floor()} months ago';
    } else {
      return '${(difference.inDays / 365).floor()} years ago';
    }
  }
}
